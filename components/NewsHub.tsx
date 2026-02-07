"use client";

import { useState } from "react";
import { Newspaper, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import type { NewsItem } from "@/lib/services/marketService";
import NewsCard from "./NewsCard";
import NewsSkeleton from "./NewsSkeleton";
import { Button } from "./ui/button";

interface NewsHubProps {
  news: NewsItem[];
  isLoading: boolean;
  compact?: boolean;
}

const NewsHub = ({ news, isLoading, compact = false }: NewsHubProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const highCount = news.filter((n) => n.impact === "HIGH").length;

  // In compact mode, show only 4 items initially
  const displayLimit = compact && !isExpanded ? 4 : news.length;
  const displayedNews = news.slice(0, displayLimit);
  const hasMore = news.length > displayLimit;

  return (
    <section className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            NewsHub
          </h2>
        </div>
        {highCount > 0 && (
          <div className="flex items-center gap-1.5 text-[10px] text-primary font-mono">
            <AlertTriangle className="h-3 w-3" />
            {highCount} HIGH
          </div>
        )}
      </div>

      <div
        className={`flex-1 overflow-y-auto space-y-2.5 pr-1 ${compact && !isExpanded ? "" : ""}`}
      >
        {isLoading ? (
          <NewsSkeleton />
        ) : (
          <>
            {displayedNews.map((item, i) => (
              <NewsCard key={item.id} item={item} index={i} />
            ))}

            {compact && hasMore && (
              <Button
                variant="outline"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full mt-3 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all group"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2 group-hover:translate-y-0.5 transition-transform" />
                    See More ({news.length - displayLimit} more)
                  </>
                )}
              </Button>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default NewsHub;
