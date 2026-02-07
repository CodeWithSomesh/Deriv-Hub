'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Copy, Edit3, Linkedin, Twitter, Sparkles, Save, X, RefreshCw } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

interface TopicItem {
  value: string
  label: string
  newsSource?: string
  actualSources?: string[]
  primarySource?: string
  lastUpdated?: number
  newsReleaseDate?: number
  sourceNews?: any[]
  context?: string
}

export default function SocialStudioPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [selectedPersona, setSelectedPersona] = useState('')
  const [additionalContext, setAdditionalContext] = useState('')
  const [includeEmojis, setIncludeEmojis] = useState(true)
  const [generatedContent, setGeneratedContent] = useState({
    linkedin: '',
    twitter: ''
  })
  const [editedContent, setEditedContent] = useState({
    linkedin: '',
    twitter: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isCheckingCompliance, setIsCheckingCompliance] = useState(false)
  const [complianceStatus, setComplianceStatus] = useState<{
    isCompliant: boolean;
    reason?: string;
  } | null>(null)
  const [error, setError] = useState('')
  const [usedProvider, setUsedProvider] = useState('')
  const [previewPlatform, setPreviewPlatform] = useState<'linkedin' | 'twitter'>('linkedin')
  
  // Dynamic topics state
  const [topics, setTopics] = useState<TopicItem[]>([
    { value: 'market-highlights', label: 'Market Highlights & Analysis', newsSource: 'Default Topics', actualSources: [], primarySource: 'Default Topics', lastUpdated: Date.now() },
    { value: 'educational-content', label: 'Trading Education & Concepts', newsSource: 'Default Topics', actualSources: [], primarySource: 'Default Topics', lastUpdated: Date.now() },
    { value: 'market-psychology', label: 'Market Psychology & Risk Management', newsSource: 'Default Topics', actualSources: [], primarySource: 'Default Topics', lastUpdated: Date.now() },
    { value: 'economic-indicators', label: 'Economic Indicators & Data', newsSource: 'Default Topics', actualSources: [], primarySource: 'Default Topics', lastUpdated: Date.now() },
    { value: 'crypto-education', label: 'Cryptocurrency Education', newsSource: 'Default Topics', actualSources: [], primarySource: 'Default Topics', lastUpdated: Date.now() },
    { value: 'forex-fundamentals', label: 'Forex Market Fundamentals', newsSource: 'Default Topics', actualSources: [], primarySource: 'Default Topics', lastUpdated: Date.now() }
  ])
  const [isLoadingTopics, setIsLoadingTopics] = useState(false)
  const [topicsLastUpdated, setTopicsLastUpdated] = useState<number | null>(null)
  const [topicsSource, setTopicsSource] = useState('fallback')

  // Fetch dynamic topics from API
  const fetchTopics = useCallback(async (isManual = false) => {
    setIsLoadingTopics(true)
    
    try {
      const response = await fetch('/api/social/topics', {
        method: isManual ? 'POST' : 'GET',
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch topics')
      }
      
      const data = await response.json()

      console.log('Topics data:', data)
      // Save current selection before updating topics
      const currentValue = selectedTopic
      
      setTopics(data.topics)
      setTopicsLastUpdated(data.lastUpdated)
      setTopicsSource(data.source)
      
      // Restore selection if it still exists in new topics
      const topicStillExists = data.topics.some((topic: any) => topic.value === currentValue)
      if (!topicStillExists && currentValue) {
        // If current selection no longer exists, keep it but show warning
        toast.info('Your selected topic has been updated. Please review the new options.')
      }
      
      // Save to localStorage for offline fallback
      localStorage.setItem('dynamicTopics', JSON.stringify({
        topics: data.topics,
        lastUpdated: data.lastUpdated,
        source: data.source
      }))
      
      if (isManual) {
        toast.success(`Topics refreshed! Found ${data.topics.length} new topics from ${data.source === 'dynamic' ? 'financial news' : 'fallback data'}`)
      }
      
    } catch (error: any) {
      console.error('Failed to fetch topics:', error)
      
      // Try to load from localStorage as fallback
      const cached = localStorage.getItem('dynamicTopics')
      if (cached) {
        const cachedData = JSON.parse(cached)
        setTopics(cachedData.topics)
        setTopicsLastUpdated(cachedData.lastUpdated)
        setTopicsSource('cached')
        
        if (isManual) {
          toast.warning('Using cached topics. Network unavailable.')
        }
      } else {
        if (isManual) {
          toast.error('Failed to refresh topics. Using default options.')
        }
      }
    } finally {
      setIsLoadingTopics(false)
    }
  }, [selectedTopic])

  // Manual topic refresh
  const handleRefreshTopics = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    fetchTopics(true)
  }

  // Helper function to format date for display
  const formatTopicDate = (timestamp?: number): string => {
    if (!timestamp) return 'Recent'
    
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Helper function to format source name with actual sources
  const formatSourceName = (topic: TopicItem): string => {
    // Use actual source if available
    if (topic.primarySource && topic.primarySource !== 'Default Topics') {
      // Format actual source display with count if multiple sources
      if (topic.actualSources && topic.actualSources.length > 1) {
        return `${topic.primarySource} +${topic.actualSources.length - 1}`
      }
      return topic.primarySource
    }
    
    // Fallback to generic labels
    if (!topic.newsSource || topic.newsSource === 'Default Topics') return 'Default'
    if (topic.newsSource === 'Live Financial News') return 'Live News'
    if (topic.newsSource === 'Finnhub') return 'Live News' // Backward compatibility
    return topic.newsSource
  }

  // Global protection against copying flagged content
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (complianceStatus && !complianceStatus.isCompliant) {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C' || e.key === 'a' || e.key === 'A' || e.key === 'x' || e.key === 'X')) {
          e.preventDefault()
          toast.error('Content copying is disabled for flagged content')
        }
      }
    }

    const handleGlobalCopy = (e: ClipboardEvent) => {
      if (complianceStatus && !complianceStatus.isCompliant) {
        e.preventDefault()
        toast.error('Content copying is disabled for flagged content')
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    document.addEventListener('copy', handleGlobalCopy)
    document.addEventListener('cut', handleGlobalCopy)

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown)
      document.removeEventListener('copy', handleGlobalCopy)
      document.removeEventListener('cut', handleGlobalCopy)
    }
  }, [complianceStatus])

  // Load topics on component mount
  useEffect(() => {
    // Try to load from localStorage first for fast loading
    const cached = localStorage.getItem('dynamicTopics')
    if (cached) {
      try {
        const cachedData = JSON.parse(cached)
        const cacheAge = Date.now() - cachedData.lastUpdated
        const SIX_HOURS = 6 * 60 * 60 * 1000
        
        if (cacheAge < SIX_HOURS) {
          // Use cached data if less than 6 hours old
          setTopics(cachedData.topics)
          setTopicsLastUpdated(cachedData.lastUpdated)
          setTopicsSource('cached')
        } else {
          // Cache is stale, fetch new topics
          fetchTopics()
        }
      } catch (error) {
        // Invalid cache, fetch new topics
        fetchTopics()
      }
    } else {
      // No cache, fetch new topics
      fetchTopics()
    }
  }, [fetchTopics])

  // Auto-refresh topics every 8 hours
  useEffect(() => {
    const SIX_HOURS = 8 * 60 * 60 * 1000 // 6 hours in milliseconds
    
    const interval = setInterval(() => {
      fetchTopics()
    }, SIX_HOURS)

    return () => clearInterval(interval)
  }, [fetchTopics])

  const handleGenerateContent = async () => {
    setIsGenerating(true)
    setError('')
    setGeneratedContent({ linkedin: '', twitter: '' }) // Clear previous content
    setEditedContent({ linkedin: '', twitter: '' })
    setIsEditing(false)
    setComplianceStatus(null)

    try {
      // Generate content for both platforms
      const [linkedinResponse, twitterResponse] = await Promise.all([
        fetch('/api/social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: selectedTopic,
            platform: 'linkedin',
            persona: selectedPersona,
            includeEmojis: includeEmojis,
            additionalContext: additionalContext.trim() || null
          }),
        }),
        fetch('/api/social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: selectedTopic,
            platform: 'twitter',
            persona: selectedPersona,
            includeEmojis: includeEmojis,
            additionalContext: additionalContext.trim() || null
          }),
        })
      ])

      if (!linkedinResponse.ok || !twitterResponse.ok) {
        const errorData = !linkedinResponse.ok 
          ? await linkedinResponse.json()
          : await twitterResponse.json()
        throw new Error(errorData.error || 'Failed to generate content')
      }

      const [linkedinData, twitterData] = await Promise.all([
        linkedinResponse.json(),
        twitterResponse.json()
      ])

      setGeneratedContent({
        linkedin: linkedinData.content,
        twitter: twitterData.content
      })
      setEditedContent({
        linkedin: linkedinData.content,
        twitter: twitterData.content
      })
      setComplianceStatus(null)
      setIsEditing(false)
      
      // Use provider from the primary platform
      const primaryData = selectedPlatform === 'linkedin' ? linkedinData : twitterData
      setUsedProvider(primaryData.provider || 'AI')
      
      if (primaryData.provider === 'Ollama') {
        toast.success('Content generated for both platforms using Ollama (Gemini fallback)')
      } else {
        toast.success('Content generated for both platforms with Gemini!')
      }
      
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate content. Please try again.'
      setError(errorMessage)
      
      // Show specific toast messages for different error types
      if (err.message?.includes('Both AI providers have exceeded quotas')) {
        toast.error('Both Gemini and Ollama have exceeded quotas. Please wait and try again.', {
          duration: 6000
        })
      } else if (err.message?.includes('Ollama server is not running')) {
        toast.error('Ollama server not running. Please start Ollama and install llama3.2:3b model.', {
          duration: 7000
        })
      } else if (err.message?.includes('quota') || err.message?.includes('rate limit')) {
        toast.error('API rate limit exceeded. Please wait before trying again.', {
          duration: 5000
        })
      } else if (err.message?.includes('API key')) {
        toast.error('API configuration error. Please check your Gemini API key.')
      } else if (err.message?.includes('Model not available') || err.message?.includes('models temporarily unavailable')) {
        toast.error('AI models temporarily unavailable. Please try again later.')
      } else if (err.message?.includes('Invalid request')) {
        toast.error('Invalid request parameters. Please try different settings.')
      } else {
        toast.error('Failed to generate content. Please try again.')
      }
      
      console.error('Content generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const checkContentCompliance = async (content: string) => {
    setIsCheckingCompliance(true)
    
    try {
      const response = await fetch('/api/social/compliance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim()
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to check compliance')
      }

      const data = await response.json()
      return {
        isCompliant: data.isCompliant,
        reason: data.reason || ''
      }
    } catch (err: any) {
      console.error('Compliance check error:', err)
      toast.error('Failed to check content compliance')
      return { isCompliant: true, reason: '' } // Default to compliant if check fails
    } finally {
      setIsCheckingCompliance(false)
    }
  }

  const handleEditContent = () => {
    setIsEditing(true)
    setComplianceStatus(null)
  }

  const handleSaveEdit = async () => {
    const contentToCheck = editedContent[previewPlatform]
    
    if (!contentToCheck.trim()) {
      toast.error('Content cannot be empty')
      return
    }

    const compliance = await checkContentCompliance(contentToCheck)
    setComplianceStatus(compliance)
    
    if (compliance.isCompliant) {
      setGeneratedContent(prev => ({
        ...prev,
        [previewPlatform]: editedContent[previewPlatform]
      }))
      setIsEditing(false)
      toast.success('Content saved successfully!')
    } else {
      toast.error('Content flagged for compliance review')
    }
  }

  const handleCancelEdit = () => {
    setEditedContent({
      linkedin: generatedContent.linkedin,
      twitter: generatedContent.twitter
    })
    setIsEditing(false)
    setComplianceStatus(null)
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-[#FF444F]/10 border border-[#FF444F]/20">
            <Sparkles className="h-5 w-5 text-[#FF444F]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Social Studio</h1>
            <p className="text-sm text-muted-foreground">Create and manage AI-powered social content</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Content Generator */}
          <Card className="border-white/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Content Generator</CardTitle>
              <CardDescription>Configure your AI assistant to create engaging posts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Topic */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="topic">Topic</Label>
                  <div className="flex items-center gap-2">
                    {topicsLastUpdated && (
                      <span className="text-xs text-muted-foreground">
                        Updated {Math.floor((Date.now() - topicsLastUpdated) / (1000 * 60))}m ago
                      </span>
                    )}
                    <button
                      onClick={handleRefreshTopics}
                      onMouseDown={(e) => e.preventDefault()}
                      disabled={isLoadingTopics}
                      className="p-1 rounded-md hover:bg-white/10 transition-colors disabled:opacity-50"
                      title="Refresh live topics from latest financial news"
                      type="button"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 text-muted-foreground ${isLoadingTopics ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
                <Select value={selectedTopic} onValueChange={setSelectedTopic} disabled={isLoadingTopics}>
                  <SelectTrigger className="dark:bg-input/30">
                    <SelectValue placeholder={isLoadingTopics ? "Loading latest topics..." : "Select live topic from financial news"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-none h-auto">
                    {topics.map((topic) => (
                      <SelectItem key={topic.value} value={topic.value}>
                        <div className="flex items-start justify-between w-full min-w-0">
                          <div className="flex items-center flex-1 pr-2">
                            {(topic.newsSource === 'Live Financial News' || (topic.actualSources && topic.actualSources.length > 0)) && (
                              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 flex-shrink-0 animate-pulse" title="Live from financial news sources" />
                            )}
                            <span className="text-sm font-medium">{topic.label}</span>
                          </div>
                          <span 
                            className="text-xs text-muted-foreground flex-shrink-0 whitespace-nowrap"
                            title={topic.actualSources && topic.actualSources.length > 0 ? 
                              `Sources: ${topic.actualSources.join(', ')}` : 
                              `Source: ${formatSourceName(topic)}`
                            }
                          >
                            ({formatSourceName(topic)} • {formatTopicDate(topic.newsReleaseDate)})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Platform */}
              <div className="space-y-2">
                <Label>Platform</Label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedPlatform === 'linkedin' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedPlatform('linkedin')
                      setPreviewPlatform('linkedin')
                    }}
                    className={selectedPlatform === 'linkedin' ? 'bg-[#FF444F] hover:bg-[#E63946]' : 'border-white/10 hover:border-[#FF444F]/30'}
                  >
                    <Linkedin className="h-4 w-4 mr-1.5" />
                    LinkedIn
                  </Button>
                  <Button
                    variant={selectedPlatform === 'twitter' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedPlatform('twitter')
                      setPreviewPlatform('twitter')
                    }}
                    className={selectedPlatform === 'twitter' ? 'bg-[#FF444F] hover:bg-[#E63946]' : 'border-white/10 hover:border-[#FF444F]/30'}
                  >
                    <Twitter className="h-4 w-4 mr-1.5" />
                    X (Twitter)
                  </Button>
                </div>
              </div>

              {/* AI Persona */}
              <div className="space-y-2">
                <Label>AI Persona</Label>
                <Select value={selectedPersona} onValueChange={setSelectedPersona}>
                  <SelectTrigger className="dark:bg-input/30">
                    <SelectValue placeholder="Select AI persona" />
                  </SelectTrigger>
                  <SelectContent className="max-h-none h-auto">
                    <SelectItem value="market-educator">The Market Educator - Educational & Informative</SelectItem>
                    <SelectItem value="data-analyst">The Data Analyst - Objective & Research-Focused</SelectItem>
                    <SelectItem value="risk-educator">The Risk Educator - Safety & Education Focused</SelectItem>
                    <SelectItem value="market-observer">The Market Observer - Neutral & Analytical</SelectItem>
                    <SelectItem value="market-jester">The Market Jester - Chaotic & Satirical</SelectItem>
                    <SelectItem value="sigma-scalper">The "Sigma Scalper" - Stoic & Ruthless</SelectItem>
                    <SelectItem value="hype-beast">The "Hype-Beast" AI Agent - Aggressive & Influential</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Emoji Switch */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emoji-switch">Include Emojis</Label>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-muted-foreground">
                      {includeEmojis ? '😊' : '📝'}
                    </span>
                    <button
                      id="emoji-switch"
                      type="button"
                      onClick={() => setIncludeEmojis(!includeEmojis)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#FF444F] focus:ring-offset-2 focus:ring-offset-gray-900 ${
                        includeEmojis 
                          ? 'bg-[#FF444F] shadow-lg shadow-[#FF444F]/25' 
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    >
                      <span className="sr-only">Toggle emojis</span>
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${
                          includeEmojis ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className={`text-sm font-medium transition-colors duration-200 ${
                      includeEmojis ? 'text-[#FF444F]' : 'text-muted-foreground'
                    }`}>
                      {includeEmojis ? 'On' : 'Off'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Add emojis to make content more engaging and visually appealing
                </p>
              </div>

              {/* Additional Content */}
              <div className="space-y-2">
                <Label htmlFor="additional">Additional Context <span className="text-xs text-muted-foreground">(Optional)</span></Label>
                <Input
                  id="additional"
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  placeholder="e.g. Focus on EURUSD, mention key economic..."
                  className="dark:bg-input/30"
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateContent}
                disabled={isGenerating || !selectedTopic || !selectedPlatform || !selectedPersona}
                className="w-full bg-[#FF444F] hover:bg-[#E63946] text-white"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="border-white/10">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Preview</CardTitle>
                  <CardDescription>AI-generated content ready for publishing</CardDescription>
                </div>
                {(generatedContent.linkedin || generatedContent.twitter) && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => setPreviewPlatform('linkedin')}
                      className={`transition-all duration-200 ${
                        previewPlatform === 'linkedin'
                          ? 'bg-[#FF444F] hover:bg-[#E63946] text-white border-0 shadow-lg scale-105'
                          : 'border border-white/20 bg-transparent text-white hover:bg-white/10 hover:scale-105'
                      }`}
                    >
                      <Linkedin className="h-3 w-3 mr-1" />
                      LinkedIn
                    </Button>
                    <Button
                      size="sm" 
                      onClick={() => setPreviewPlatform('twitter')}
                      className={`transition-all duration-200 ${
                        previewPlatform === 'twitter'
                          ? 'bg-[#FF444F] hover:bg-[#E63946] text-white border-0 shadow-lg scale-105'
                          : 'border border-white/20 bg-transparent text-white hover:bg-white/10 hover:scale-105'
                      }`}
                    >
                      <Twitter className="h-3 w-3 mr-1" />
                      X
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Author Profile */}
              <div className="flex items-center gap-3 p-3 rounded-md bg-card/50 border border-white/5">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="bg-[#FF444F] text-white text-sm">CA</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {selectedPersona ? (
                      selectedPersona === 'market-educator' ? 'The Market Educator' :
                      selectedPersona === 'data-analyst' ? 'The Data Analyst' :
                      selectedPersona === 'risk-educator' ? 'The Risk Educator' :
                      selectedPersona === 'market-observer' ? 'The Market Observer' :
                      selectedPersona === 'market-jester' ? 'The Market Jester' :
                      selectedPersona === 'sigma-scalper' ? 'The "Sigma Scalper"' :
                      selectedPersona === 'hype-beast' ? 'The "Hype-Beast" AI Agent' :
                      'AI Persona'
                    ) : 'AI Persona'}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                      {selectedPersona === 'market-jester' ? 'Chaotic & Satirical' :
                       selectedPersona === 'sigma-scalper' ? 'Stoic & Ruthless' :
                       selectedPersona === 'hype-beast' ? 'Aggressive & Influential' :
                       'Educational AI Assistant'}
                    </p>
                    {usedProvider && (
                      <Badge 
                        variant="outline" 
                        className={
                          usedProvider === 'Ollama' 
                            ? "border-green-500/30 bg-green-500/10 text-green-400 text-xs px-1.5 py-0.5"
                            : "border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs px-1.5 py-0.5"
                        }
                      >
                        {usedProvider}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs">
                    {previewPlatform === 'linkedin' ? 'LinkedIn' : 'X (Twitter)'}
                  </Badge>
                  <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs">
                    {selectedTopic ? selectedTopic.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Content Topic'}
                  </Badge>
                </div>
              </div>

              {/* Generated Content */}
              <div className="space-y-3">
                {error && (
                  <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm space-y-2">
                    <p>{error}</p>
                    {(error.includes('quota') || error.includes('rate limit')) && (
                      <div className="text-xs text-red-300 space-y-1">
                        <p><strong>Check your usage:</strong></p>
                        <p>• <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-200">Gemini AI Studio</a> (Primary)</p>
                        <p>• Ollama (Local fallback - no usage limits)</p>
                        <p className="mt-2">The system tries Gemini first, then Ollama if needed.</p>
                      </div>
                    )}
                    {error.includes('Model not available') && (
                      <p className="text-xs text-red-300">
                        AI models are temporarily unavailable. Please try again later.
                      </p>
                    )}
                    {error.includes('API key') && (
                      <p className="text-xs text-red-300">
                        Please check your API keys in the environment configuration.
                      </p>
                    )}
                    {error.includes('Ollama server') && (
                      <div className="text-xs text-red-300 space-y-1">
                        <p><strong>Ollama Setup Required:</strong></p>
                        <p>1. Install Ollama: <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-200">ollama.ai</a></p>
                        <p>2. Run: <code className="bg-red-900/30 px-1 rounded">ollama pull llama3.2:3b</code></p>
                        <p>3. Start: <code className="bg-red-900/30 px-1 rounded">ollama serve</code></p>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="p-4 rounded-md bg-card/30 border border-white/5 text-sm leading-relaxed min-h-[200px] transition-all duration-200">
                  {generatedContent.linkedin || generatedContent.twitter ? (
                    <div className="space-y-3">
                      {!isEditing ? (
                        <div className="whitespace-pre-wrap transition-opacity duration-200">
                          {generatedContent[previewPlatform]}
                        </div>
                      ) : (
                        <textarea
                          value={editedContent[previewPlatform]}
                          onChange={(e) => setEditedContent(prev => ({
                            ...prev,
                            [previewPlatform]: e.target.value
                          }))}
                          className="w-full min-h-[150px] bg-transparent border border-white/10 rounded-md p-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#FF444F] focus:border-transparent"
                          placeholder="Edit your content here..."
                        />
                      )}
                      
                      {/* Compliance Status */}
                      {complianceStatus && !complianceStatus.isCompliant && (
                        <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-xs space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            <span className="font-medium">Content Flagged</span>
                          </div>
                          <p>{complianceStatus.reason}</p>
                          <p className="text-red-300">Please edit your content to remove any direct buy/sell recommendations.</p>
                        </div>
                      )}

                      {/* Edit Mode Controls */}
                      {isEditing && (
                        <div className="flex gap-2 pt-2 border-t border-white/10">
                          <Button
                            size="sm"
                            onClick={handleSaveEdit}
                            disabled={isCheckingCompliance}
                            className="bg-[#FF444F] hover:bg-[#E63946] text-white"
                          >
                            {isCheckingCompliance ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1.5" />
                                Checking...
                              </>
                            ) : (
                              <>
                                <Save className="h-3 w-3 mr-1.5" />
                                Save Changes
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                            disabled={isCheckingCompliance}
                            className="border-white/20 hover:bg-white/10"
                          >
                            <X className="h-3 w-3 mr-1.5" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      {isGenerating ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FF444F]" />
                          Generating content for both platforms...
                        </div>
                      ) : (
                        'Generated content will appear here. Configure your settings and click "Generate Content" to get started.'
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {(generatedContent.linkedin || generatedContent.twitter) && !isEditing && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      disabled={!!(complianceStatus && !complianceStatus.isCompliant)}
                      className={`${
                        complianceStatus && !complianceStatus.isCompliant
                          ? 'border-gray-500/30 text-gray-500 cursor-not-allowed'
                          : 'border-[#FF444F]/30 text-[#FF444F] hover:bg-[#FF444F]/10'
                      }`}
                      onClick={async () => {
                        if (complianceStatus && !complianceStatus.isCompliant) return
                        
                        try {
                          const contentToCopy = generatedContent[previewPlatform]
                          await navigator.clipboard.writeText(contentToCopy)
                          toast.success(`${previewPlatform === 'linkedin' ? 'LinkedIn' : 'X'} content copied to clipboard!`)
                        } catch (err) {
                          toast.error('Failed to copy content')
                        }
                      }}
                    >
                      <Copy className="h-4 w-4 mr-1.5" />
                      {complianceStatus && !complianceStatus.isCompliant ? 'Copy Disabled' : `Copy ${previewPlatform === 'linkedin' ? 'LinkedIn' : 'X'} Text`}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-white/10 hover:border-white/20"
                      onClick={handleEditContent}
                    >
                      <Edit3 className="h-4 w-4 mr-1.5" />
                      Edit
                    </Button>
                  </div>
                )}

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
