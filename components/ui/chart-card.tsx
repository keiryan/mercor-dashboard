'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  children: React.ReactNode;
  title: string;
  footer?: string;
  index: number;
  className?: string;
}

export function ChartCard({ children, title, footer, index, className }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn(
        "h-[400px] rounded-lg bg-card p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_0_rgba(0,0,0,0.5)] dark:border dark:border-border/50",
        className
      )}
    >
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold mb-6">{title}</h3>
        <div className="flex-grow">
          {children}
        </div>
        {footer && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        )}
      </div>
    </motion.div>
  );
}