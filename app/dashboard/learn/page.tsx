'use client'

import { useState } from 'react'
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fetchMarketNews } from '@/lib/services/marketService'
import MarketTicker from '@/components/MarketTicker'
import NewsHub from '@/components/NewsHub'
import ChatPanel from '@/components/ChatPanel'
import { DerivLearn } from '@/components/learn'

const queryClient = new QueryClient()

function LearnContent() {
  const [activeTopic, setActiveTopic] = useState<string | null>(null)
  
  const { data: news = [], isLoading: newsLoading } = useQuery({
    queryKey: ['marketNews'],
    queryFn: fetchMarketNews,
    refetchInterval: 5 * 60_000,
    staleTime: 2 * 60_000,
  })

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-4">
      {/* Market Ticker */}
      <div className="shrink-0">
        <MarketTicker />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
        {/* Top Section: News + Chat Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* NewsHub — 40% */}
          <div className="lg:col-span-5 glass-card p-4 lg:p-5 flex flex-col">
            <NewsHub news={news} isLoading={newsLoading} compact />
          </div>

          {/* Chat — 60% */}
          <div className="lg:col-span-7 glass-card p-4 lg:p-5 flex flex-col min-h-125">
            <ChatPanel news={news} onTopicChange={setActiveTopic} />
          </div>
        </div>

        {/* Bottom Section: Video Learning Hub */}
        <div className="glass-card p-4 lg:p-6">
          <DerivLearn activeTopic={activeTopic} setActiveTopic={setActiveTopic} />
        </div>
      </div>
    </div>
  )
}

export default function LearnPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="@container/main flex flex-1 flex-col h-full">
        <div className="flex flex-col h-full py-4 md:py-6 px-4 lg:px-6">
          <LearnContent />
        </div>
      </div>
    </QueryClientProvider>
  )
}
