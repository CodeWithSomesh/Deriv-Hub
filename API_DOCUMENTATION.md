# 🚀 Social Studio API Documentation

## 📋 Consolidated API Endpoint

**Base URL**: `/api/social`

This single endpoint handles both content generation and AI model testing through different HTTP methods.

---

## 🎯 **POST** - Generate Social Content

### **Endpoint**
```
POST /api/social
```

### **Request Body**
```json
{
  "topic": "market-highlights",
  "platform": "linkedin", 
  "persona": "market-educator",
  "tone": "professional",
  "additionalContext": "Focus on EUR/USD analysis" // Optional
}
```

### **Required Parameters**
- `topic`: Content topic (market-highlights, educational-content, etc.)
- `platform`: Social platform (linkedin, twitter)
- `persona`: AI persona (market-educator, data-analyst, etc.)
- `tone`: Content tone (professional, conversational, etc.)

### **Optional Parameters**
- `additionalContext`: Extra context for content generation

### **Success Response** (200)
```json
{
  "content": "Generated social media content here...",
  "provider": "Gemini", // or "OpenAI"
  "message": "Generated using Gemini",
  "endpoint": "/api/social (POST) - Content Generation"
}
```

### **Error Responses**

**400 - Bad Request**
```json
{
  "error": "Missing required parameters: topic, platform, persona, tone"
}
```

**401 - Unauthorized**
```json
{
  "error": "Invalid API key. Please check your API configuration."
}
```

**429 - Rate Limited**
```json
{
  "error": "Both AI providers have exceeded quotas. Please wait a few minutes and try again.",
  "isQuotaError": true
}
```

**404 - Model Unavailable**
```json
{
  "error": "AI models temporarily unavailable. Please try again later."
}
```

---

## 🔍 **GET** - Test AI Models

### **Endpoint**
```
GET /api/social
```

### **Response** (200)
```json
{
  "results": {
    "gemini": {
      "available": ["gemini-pro"],
      "tested": ["gemini-pro", "gemini-1.5-pro", "gemini-1.5-flash"],
      "status": "working"
    },
    "openai": {
      "available": ["gpt-3.5-turbo", "gpt-4"],
      "tested": ["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo", "gpt-4o-mini"],
      "status": "working"
    }
  },
  "summary": {
    "totalAvailable": 3,
    "primaryWorking": true,
    "fallbackWorking": true,
    "systemStatus": "Both Gemini (primary) and OpenAI (fallback) are working perfectly"
  },
  "message": "Both Gemini (primary) and OpenAI (fallback) are working perfectly",
  "endpoint": "/api/social (GET) - Model Testing"
}
```

### **Error Response** (500)
```json
{
  "error": "Failed to test AI models",
  "details": "Error details here...",
  "endpoint": "/api/social (GET)"
}
```

---

## 🛡️ **AI Provider Fallback System**

### **Request Flow**
1. **POST Request** → Try Gemini (primary)
2. **Gemini Success** → Return content with provider: "Gemini"
3. **Gemini Fails** → Try OpenAI (fallback)
4. **OpenAI Success** → Return content with provider: "OpenAI"
5. **Both Fail** → Return appropriate error message

### **Available Models**

**Gemini Models** (Primary)
- `gemini-pro` ✅ **Used by default**
- `gemini-1.5-pro` (tested)
- `gemini-1.5-flash` (tested)

**OpenAI Models** (Fallback)
- `gpt-3.5-turbo` ✅ **Used by default**
- `gpt-4` (tested)
- `gpt-4-turbo` (tested)
- `gpt-4o-mini` (tested)

---

## 🔧 **Environment Configuration**

Required environment variables in `.env.local`:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

---

## 🎯 **Content Safety Features**

All generated content automatically:
- ✅ **Removes buy/sell signals** - Sanitizes trading advice
- ✅ **Neutral language** - Uses educational phrasing
- ✅ **Risk disclaimers** - Includes market volatility warnings
- ✅ **Platform optimization** - Respects character/word limits
- ❌ **No investment advice** - Educational focus only

### **Content Sanitization**
```javascript
// Automatic replacements and cleanup applied:

// Trading signals removed:
'buy|sell|long|short' → '' (removed)
'bullish on XYZ' → 'market sentiment suggests'  
'strong buy' → 'worth monitoring'

// Meta-commentary removed:
'(Note: The post is within 300-word limit...)' → '' (removed)
'(This post maintains neutral tone...)' → '' (removed)
'*Note: Educational purposes only*' → '' (removed)

// Whitespace cleaned:
Multiple spaces → Single space
Excessive line breaks → Proper formatting
```

---

## 📊 **Usage Examples**

### **Frontend Integration**
```javascript
// Generate content
const response = await fetch('/api/social', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: 'market-highlights',
    platform: 'linkedin',
    persona: 'market-educator',
    tone: 'professional'
  })
});

const data = await response.json();
console.log(data.content); // Generated content
console.log(data.provider); // "Gemini" or "OpenAI"
```

### **Test Models**
```javascript
// Check AI availability
const response = await fetch('/api/social');
const data = await response.json();

console.log(data.summary.systemStatus);
// "Both Gemini (primary) and OpenAI (fallback) are working perfectly"
```

---

## 📈 **Benefits of Consolidated API**

### ✅ **Simplified Architecture**
- **Single endpoint** handles all social studio operations
- **Consistent error handling** across all features
- **Unified logging** and monitoring

### ✅ **Developer Experience** 
- **Easy to maintain** - one file vs multiple
- **Clear documentation** - all methods in one place
- **Consistent responses** - same structure everywhere

### ✅ **Performance**
- **Reduced code duplication** - shared AI provider logic
- **Faster builds** - fewer files to compile
- **Better caching** - single endpoint optimization

---

## 🔍 **Debugging & Monitoring**

### **Console Logs**
```
Attempting content generation with Gemini...
✅ Gemini generation successful
```

```
❌ Gemini failed: quota exceeded
🔄 Falling back to OpenAI...
✅ OpenAI fallback successful
```

### **Testing Commands**
```bash
# Test model availability
curl http://localhost:3000/api/social

# Generate content
curl -X POST http://localhost:3000/api/social \
  -H "Content-Type: application/json" \
  -d '{"topic":"market-highlights","platform":"linkedin","persona":"market-educator","tone":"professional"}'
```

Your Social Studio API is now consolidated and optimized! 🎉