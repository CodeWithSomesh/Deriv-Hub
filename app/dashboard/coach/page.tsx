'use client'

import * as React from 'react'
import {
  IconCircleCheck,
  IconInfoCircle,
  IconAlertTriangle,
  IconPlayerPlay,
  IconPlayerStop,
  IconChartLine,
} from '@tabler/icons-react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'

const pnlData = [
  { time: '09:00', pnl: -20 },
  { time: '10:00', pnl: 45 },
  { time: '11:00', pnl: 120 },
  { time: '12:00', pnl: 85 },
  { time: '13:00', pnl: 200 },
  { time: '14:00', pnl: 165 },
  { time: '15:00', pnl: 310 },
]

const chartConfig = {
  pnl: {
    label: 'P&L',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

const alerts = [
  {
    type: 'positive' as const,
    time: '2 min ago',
    text: 'Great discipline! You took profit at your target instead of getting greedy. This is excellent risk management.',
  },
  {
    type: 'info' as const,
    time: '15 min ago',
    text: "Pattern detected: You tend to perform better in morning sessions. Consider focusing your active trading before 1 PM.",
  },
  {
    type: 'warning' as const,
    time: '1 hour ago',
    text: "Frequency alert: You've made 8 trades in the last hour, above your typical pace. Consider taking a short break to maintain focus.",
  },
  {
    type: 'positive' as const,
    time: '1 hour ago',
    text: 'Excellent exit! You cut that loss quickly instead of hoping for a reversal. This saved you from a larger loss.',
  },
  {
    type: 'info' as const,
    time: '2 hours ago',
    text: 'Session started: Trading normally. All systems monitoring your behavior in real-time.',
  },
]

const alertStyles = {
  positive: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  info: 'border-[#FF444F]/30 bg-[#FF444F]/10 text-[#FF444F]',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
}

const alertIcons = {
  positive: IconCircleCheck,
  info: IconInfoCircle,
  warning: IconAlertTriangle,
}

export default function LiveCoachPage() {
  const [monitoring, setMonitoring] = React.useState(true)

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
        {/* Session controls */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-500 text-white"
            onClick={() => setMonitoring(true)}
          >
            <IconPlayerPlay className="size-4" />
            Start Monitoring
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-[#FF444F]/50 text-[#FF444F] hover:bg-[#FF444F]/10"
            onClick={() => setMonitoring(false)}
          >
            <IconPlayerStop className="size-4" />
            Stop Session
          </Button>
          {monitoring && (
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Monitoring
            </Badge>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Current Session */}
          <Card className="border-white/10">
            <CardHeader>
              <CardTitle className="text-base">Current Session</CardTitle>
              <CardDescription>Real-time session overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Time in session</p>
                  <p className="font-semibold tabular-nums text-lg">2h 34m</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Trades executed</p>
                  <p className="font-semibold tabular-nums text-lg">12</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Win / Loss</p>
                  <p className="font-semibold tabular-nums">8 / 4</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Risk score</p>
                  <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 font-normal">
                    Low
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Patterns */}
          <Card className="border-white/10 md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Your Patterns</CardTitle>
              <CardDescription>Behavioral insights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Typical trade frequency</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-[70%] rounded-full bg-[#FF444F]/60" />
                  </div>
                  <span className="text-xs tabular-nums">8–10/day</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Best trading hours</p>
                <p className="font-medium">8AM – 12PM</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Emotional trigger</p>
                <p className="font-medium text-amber-400">After losses</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Alerts & Insights */}
        <Card className="border-white/10">
          <CardHeader>
            <CardTitle className="text-base">Live Alerts & Insights</CardTitle>
            <CardDescription>AI-generated feedback in real time</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
              {alerts.map((alert, i) => {
                const Icon = alertIcons[alert.type]
                return (
                  <li
                    key={i}
                    className={`flex gap-3 rounded-lg border p-3 text-sm ${alertStyles[alert.type]}`}
                  >
                    <Icon className="size-5 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground/90">{alert.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>

        {/* Real-Time P&L */}
        <Card className="border-white/10">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <IconChartLine className="size-4 text-[#FF444F]" />
              Real-Time P&L
            </CardTitle>
            <CardDescription>Session profit & loss over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[240px] w-full">
              <AreaChart data={pnlData}>
                <defs>
                  <linearGradient id="fillPnl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-pnl)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-pnl)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-white/10" vertical={false} />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: 'var(--muted-foreground)' }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value) => (
                        <>
                          <span className="font-medium">${Number(value).toFixed(0)}</span>
                          <span className="text-muted-foreground"> P&L</span>
                        </>
                      )}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="pnl"
                  fill="url(#fillPnl)"
                  stroke="var(--color-pnl)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
