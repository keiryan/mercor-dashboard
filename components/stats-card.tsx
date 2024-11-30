'use client';

import { LucideIcon } from 'lucide-react';
import { formatTrendValue } from '@/lib/stats-utils';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  trend: number;
  trendLabel: string;
  icon: LucideIcon;
  flippable?: boolean;
  backSide?: {
    title: string;
    value: string | number;
    description: string;
    trend: number;
    trendLabel: string;
  };
}

export function StatsCard({
  title,
  value,
  description,
  trend,
  trendLabel,
  icon: Icon,
  flippable = false,
  backSide,
}: StatsCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const getTrendDetails = (trendValue: number) => {
    const color = trendValue > 0 ? 'text-green-500' : trendValue < 0 ? 'text-red-500' : 'text-muted-foreground';
    const icon = trendValue > 0 ? '↑' : trendValue < 0 ? '↓' : '−';
    const formattedValue = formatTrendValue(trendValue);
    return { color, icon, formattedValue };
  };

  const frontTrend = getTrendDetails(trend);
  const backTrend = backSide ? getTrendDetails(backSide.trend) : null;

  const cardContent = (side: 'front' | 'back') => (
    <div className="h-full flex flex-col min-h-[180px]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          {side === 'front' ? title : backSide?.title}
        </h3>
        <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
      </div>
      <div className="mt-2 flex-grow">
        <p className="text-2xl font-bold truncate">
          {side === 'front' ? value : backSide?.value}
        </p>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {side === 'front' ? description : backSide?.description}
        </p>
      </div>
      <div className="mt-2 border-t border-border/50 pt-2">
        {side === 'front' ? (
          <span className={`flex items-center text-sm ${frontTrend.color}`}>
            {frontTrend.icon} {frontTrend.formattedValue}% {trendLabel}
          </span>
        ) : backTrend && backSide && (
          <span className={`flex items-center text-sm ${backTrend.color}`}>
            {backTrend.icon} {backTrend.formattedValue}% {backSide.trendLabel}
          </span>
        )}
      </div>
    </div>
  );

  const cardClasses = cn(
    "rounded-lg bg-card p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_0_rgba(0,0,0,0.5)] dark:border dark:border-border/50",
    flippable && "cursor-pointer perspective-1000",
  );

  if (!flippable || !backSide) {
    return <div className={cardClasses}>{cardContent('front')}</div>;
  }

  return (
    <div
      className={cardClasses}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="flip-card">
        <div 
          className="flip-card-inner"
          style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)' }}
        >
          <div className="flip-card-front">
            {cardContent('front')}
          </div>
          <div className="flip-card-back">
            {cardContent('back')}
          </div>
        </div>
      </div>
    </div>
  );
}