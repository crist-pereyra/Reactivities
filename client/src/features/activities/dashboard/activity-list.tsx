import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ActivityCardSkeleton } from '../skeleton/activity-card-skeleton';
import { ActivityCard } from './activity-card';
import { useActivities } from '@/lib/hooks/useActivities';
import { AlertCircle } from 'lucide-react';
import { Fragment } from 'react/jsx-runtime';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import { useEffect } from 'react';

export const ActivityList = () => {
  const { activitiesGroup, isLoading, hasNextPage, fetchNextPage } =
    useActivities();
  const [ref, entry] = useIntersectionObserver({
    threshold: 0.5,
    root: null,
    rootMargin: '0px',
  });
  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [entry, hasNextPage, fetchNextPage]);
  return (
    <div className='flex flex-col gap-3 p-6 mt-14'>
      {isLoading ? (
        <>
          {Array.from({ length: 5 }).map((_, i) => (
            <ActivityCardSkeleton key={i} />
          ))}
        </>
      ) : !activitiesGroup ? (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>No activities found</AlertDescription>
        </Alert>
      ) : (
        <>
          {activitiesGroup.pages.map((activities, index) => (
            <Fragment key={index}>
              {activities.items.map((activity) => (
                <ActivityCard activity={activity} key={activity.id} />
              ))}
            </Fragment>
          ))}
          {hasNextPage && (
            <div ref={ref}>
              <ActivityCardSkeleton />
            </div>
          )}
        </>
      )}
    </div>
  );
};
