// Temporarily disabled due to TypeScript issues
// This component needs significant refactoring to work with the current Recharts version

import React from 'react';
import { cn } from '@/lib/utils';

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("h-[350px] w-full", className)}
    {...props}
  />
));
ChartContainer.displayName = "ChartContainer";

export const Chart = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("h-[350px] w-full", className)}
    {...props}
  />
));
Chart.displayName = "Chart";

export const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-lg border bg-background p-2 text-sm shadow-sm", className)}
    {...props}
  />
));
ChartTooltip.displayName = "ChartTooltip";

export const ChartLegend = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2", className)}
    {...props}
  />
));
ChartLegend.displayName = "ChartLegend";

export const ChartStyle = ({ id }: { id: string }) => {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          .recharts-legend-item-${id} {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .recharts-legend-item-${id} .recharts-legend-icon {
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 50%;
          }
        `,
      }}
    />
  );
};
