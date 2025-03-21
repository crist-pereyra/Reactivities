import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ActivityCardSkeleton } from '../skeleton/activity-card-skeleton';
import { ActivityCard } from './activity-card';
import { useActivities } from '@/lib/hooks/useActivities';
import { AlertCircle } from 'lucide-react';

export const ActivityList = () => {
  const { activities, isFetching } = useActivities();
  return (
    <div className='flex flex-col gap-3 p-6 mt-14'>
      {isFetching ? (
        <>
          {Array.from({ length: 5 }).map((_, i) => (
            <ActivityCardSkeleton key={i} />
          ))}
        </>
      ) : !activities ? (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>No activities found</AlertDescription>
        </Alert>
      ) : (
        <>
          {activities.map((activity) => (
            <ActivityCard activity={activity} key={activity.id} />
          ))}
        </>
      )}
    </div>
  );
};
