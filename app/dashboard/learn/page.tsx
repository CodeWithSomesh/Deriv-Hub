'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function LearnPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:py-6 px-4 lg:px-6">
        <Card className="border-white/10 border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Learn</CardTitle>
            <CardDescription>Trading education and courses</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Content coming soon. This section will host learning modules and resources.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
