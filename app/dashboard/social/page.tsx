'use client'

import { useState } from 'react'
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
import { Copy, Edit3, Eye, TrendingUp, Linkedin, Twitter, Sparkles } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function SocialStudioPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [selectedPersona, setSelectedPersona] = useState('')
  const [selectedTone, setSelectedTone] = useState('')

  const handleGenerateContent = async () => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => setIsGenerating(false), 2000)
  }

  const generatedContent = `Today's calm ante in the EUR/USD market largely different currency trends doesn't differentiate sentiment, catalyzing a break above the 1.0450 resistance level that's held for three weeks.

The EUR/USD Legarto's comments on medium risk-risk shifted market sentiment, catalyzing a break above the 1.0450 resistance level that's held for three weeks. These are key takeaways for traders:

1. Central bank communication drives short-term volatility
2. Technical levels matter - resistance becomes support
3. Position accordingly for ripple effects in correlated pairs

When your EUR/USD outlook for next week?

#ForexTrading #MarketAnalysis #EURUSD`

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
                <Label htmlFor="topic">Topic</Label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger className="dark:bg-input/30">
                    <SelectValue placeholder="Select Market Highlights" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market-highlights">Market Highlights</SelectItem>
                    <SelectItem value="crypto-analysis">Crypto Analysis</SelectItem>
                    <SelectItem value="forex-updates">Forex Updates</SelectItem>
                    <SelectItem value="trading-tips">Trading Tips</SelectItem>
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
                    onClick={() => setSelectedPlatform('linkedin')}
                    className={selectedPlatform === 'linkedin' ? 'bg-[#FF444F] hover:bg-[#E63946]' : 'border-white/10 hover:border-[#FF444F]/30'}
                  >
                    <Linkedin className="h-4 w-4 mr-1.5" />
                    LinkedIn
                  </Button>
                  <Button
                    variant={selectedPlatform === 'twitter' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPlatform('twitter')}
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
                  <SelectContent>
                    <SelectItem value="calm-analyst">The Trading Coach - Motivational & Educational</SelectItem>
                    <SelectItem value="technical-expert">The Technical Expert</SelectItem>
                    <SelectItem value="market-strategist">The Market Strategist</SelectItem>
                    <SelectItem value="risk-manager">The Risk Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tone */}
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={selectedTone} onValueChange={setSelectedTone}>
                  <SelectTrigger className="dark:bg-input/30">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="analytical">Analytical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Content */}
              <div className="space-y-2">
                <Label htmlFor="additional">Additional Context <span className="text-xs text-muted-foreground">(Optional)</span></Label>
                <Input
                  id="additional"
                  placeholder="e.g. Focus on EURUSD, mention key economic..."
                  className="dark:bg-input/30"
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateContent}
                disabled={isGenerating || !selectedTopic || !selectedPlatform}
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
              <CardTitle className="text-base">Preview</CardTitle>
              <CardDescription>AI-generated content ready for publishing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Author Profile */}
              <div className="flex items-center gap-3 p-3 rounded-md bg-card/50 border border-white/5">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="bg-[#FF444F] text-white text-sm">CA</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">The Calm Analyst</p>
                  <p className="text-xs text-muted-foreground">AI Persona</p>
                </div>
                <Badge variant="outline" className="ml-auto border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs">
                  EUR/USD Market Update
                </Badge>
              </div>

              {/* Generated Content */}
              <div className="space-y-3">
                <div className="p-4 rounded-md bg-card/30 border border-white/5 text-sm leading-relaxed">
                  {generatedContent}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-[#FF444F]/30 text-[#FF444F] hover:bg-[#FF444F]/10">
                    <Copy className="h-4 w-4 mr-1.5" />
                    Copy Text
                  </Button>
                  <Button size="sm" variant="outline" className="border-white/10 hover:border-white/20">
                    <Edit3 className="h-4 w-4 mr-1.5" />
                    Edit
                  </Button>
                </div>

                <Separator className="my-4 bg-white/10" />

                {/* Performance Metrics */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Your Performance</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-md bg-card/30 border border-white/5">
                      <div className="flex items-center justify-center gap-1.5 text-2xl font-semibold text-[#FF444F] mb-1">
                        <Eye className="h-5 w-5" />
                        1,247
                      </div>
                      <p className="text-xs text-muted-foreground">Total Reach</p>
                    </div>
                    <div className="text-center p-3 rounded-md bg-amber-500/10 border border-amber-500/20">
                      <div className="flex items-center justify-center gap-1.5 text-2xl font-semibold text-amber-400 mb-1">
                        <TrendingUp className="h-5 w-5" />
                        4.2%
                      </div>
                      <p className="text-xs text-muted-foreground">Engagement Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
