'use client';

import type * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface VerticalTabsProps
  extends React.ComponentPropsWithoutRef<typeof Tabs> {
  className?: string;
  tabsListClassName?: string;
  tabsContentClassName?: string;
}

export function VerticalTabs({
  className,
  children,
  ...props
}: VerticalTabsProps) {
  return (
    <Tabs {...props} className={cn('flex flex-row gap-6 space-y-0', className)}>
      {children}
    </Tabs>
  );
}

interface VerticalTabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsList> {
  className?: string;
}

export function VerticalTabsList({
  className,
  ...props
}: VerticalTabsListProps) {
  return (
    <TabsList
      {...props}
      className={cn(
        'flex h-auto min-w-[180px] flex-col items-stretch justify-start rounded-md p-1',
        className
      )}
    />
  );
}

interface VerticalTabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsTrigger> {
  className?: string;
}

export function VerticalTabsTrigger({
  className,
  ...props
}: VerticalTabsTriggerProps) {
  return (
    <TabsTrigger
      {...props}
      className={cn(
        // 'justify-start px-3 py-2 text-left data-[state=active]:border-r-2 data-[state=active]:border-primary',
        'justify-start px-3 py-2 text-left',
        className
      )}
    />
  );
}

interface VerticalTabsContentProps
  extends React.ComponentPropsWithoutRef<typeof TabsContent> {
  className?: string;
}

export function VerticalTabsContent({
  className,
  ...props
}: VerticalTabsContentProps) {
  return <TabsContent {...props} className={cn('mt-0 flex-1', className)} />;
}
