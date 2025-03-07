import { ActivityCardSkeleton } from '../skeleton/activity-card-skeleton';
import { ActivityCard } from './activity-card';
import { useActivities } from '@/lib/hooks/useActivities';

export const ActivityList = () => {
  const { activities, isPending } = useActivities();
  return (
    <div className='flex flex-col gap-3 p-6 mt-14'>
      {!activities || isPending ? (
        <>
          {Array.from({ length: 5 }).map((_, i) => (
            <ActivityCardSkeleton key={i} />
          ))}
        </>
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
