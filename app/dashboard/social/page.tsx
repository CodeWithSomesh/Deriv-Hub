'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function SocialStudioPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:py-6 px-4 lg:px-6">
        <Card className="border-white/10 border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Social Studio</CardTitle>
            <CardDescription>Generate and manage social content</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Content coming soon. AI-powered social content generation will live here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
