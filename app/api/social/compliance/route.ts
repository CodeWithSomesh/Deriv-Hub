import { GoogleGenerativeAI } from '@google/generative-ai'
import { Ollama } from 'ollama'
import { NextRequest, NextResponse } from 'next/server'

// Initialize both AI providers
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const ollama = new Ollama({ 
  host: process.env.OLLAMA_BASE_URL || 'http://localhost:11434' 
})

// Check compliance using Gemini AI (primary)
async function checkComplianceWithGemini(content: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const prompt = `You are a compliance checker for financial content. Analyze the following content and determine if it contains direct buy/sell signals, investment advice, or trading recommendations.

CONTENT TO CHECK:
"${content}"

COMPLIANCE RULES:
1. Content should NOT contain direct buy/sell recommendations
2. Content should NOT tell people to invest in specific assets
3. Content should NOT use phrases like "buy now", "sell immediately", "invest in", "purchase", "go long", "go short"
4. Content should focus on education, analysis, and general market insights
5. Neutral language like "analysts suggest", "data shows", "according to reports" is acceptable
6. Questions to engage discussion are acceptable

RESPONSE FORMAT:
Respond with ONLY a JSON object in this exact format:
{
  "isCompliant": true/false,
  "reason": "Brief explanation if not compliant, empty string if compliant"
}

Do not include any other text, explanations, or formatting - just the JSON object.`

  const result = await model.generateContent(prompt)
  const response = result.response.text().trim()
  
  try {
    return JSON.parse(response)
  } catch (error) {
    console.error('Failed to parse Gemini response:', response)
    // If parsing fails, default to non-compliant for safety
    return {
      isCompliant: false,
      reason: 'Unable to verify compliance - please review content manually'
    }
  }
}

// Check compliance using Ollama (fallback)
async function checkComplianceWithOllama(content: string) {
  const prompt = `You are a compliance checker for financial content. Analyze the following content and determine if it contains direct buy/sell signals, investment advice, or trading recommendations.

CONTENT TO CHECK:
"${content}"

COMPLIANCE RULES:
1. Content should NOT contain direct buy/sell recommendations
2. Content should NOT tell people to invest in specific assets
3. Content should NOT use phrases like "buy now", "sell immediately", "invest in", "purchase", "go long", "go short"
4. Content should focus on education, analysis, and general market insights
5. Neutral language like "analysts suggest", "data shows", "according to reports" is acceptable
6. Questions to engage discussion are acceptable

RESPONSE FORMAT:
Respond with ONLY a JSON object in this exact format:
{
  "isCompliant": true/false,
  "reason": "Brief explanation if not compliant, empty string if compliant"
}

Do not include any other text, explanations, or formatting - just the JSON object.`

  const response = await ollama.generate({
    model: process.env.OLLAMA_MODEL || 'llama3.2:3b',
    prompt: prompt,
    options: {
      temperature: 0.1,
      num_predict: 100,
    }
  })

  const responseText = response.response.trim()
  
  try {
    return JSON.parse(responseText)
  } catch (error) {
    console.error('Failed to parse Ollama response:', responseText)
    // If parsing fails, default to non-compliant for safety
    return {
      isCompliant: false,
      reason: 'Unable to verify compliance - please review content manually'
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      )
    }

    let complianceResult = null

    // Try Gemini first (primary)
    try {
      console.log('Checking compliance with Gemini...')
      complianceResult = await checkComplianceWithGemini(content)
      console.log('✅ Gemini compliance check successful')
    } catch (geminiError: any) {
      console.log('❌ Gemini compliance check failed:', geminiError.message)
      
      // Fallback to Ollama
      try {
        console.log('🔄 Falling back to Ollama for compliance check...')
        complianceResult = await checkComplianceWithOllama(content)
        console.log('✅ Ollama compliance check successful')
      } catch (ollamaError: any) {
        console.error('❌ Both compliance checks failed:', {
          gemini: geminiError.message,
          ollama: ollamaError.message
        })
        
        // If both fail, default to non-compliant for safety
        return NextResponse.json({
          isCompliant: false,
          reason: 'Unable to verify compliance due to technical issues. Please review content manually.'
        })
      }
    }

    return NextResponse.json({
      isCompliant: complianceResult.isCompliant,
      reason: complianceResult.reason || ''
    })

  } catch (error: any) {
    console.error('Compliance check error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to check compliance',
        isCompliant: false,
        reason: 'Technical error occurred during compliance check'
      },
      { status: 500 }
    )
  }
}