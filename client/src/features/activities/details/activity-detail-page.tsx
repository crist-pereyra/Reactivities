import { useActivities } from '@/lib/hooks/useActivities';
import { ActivityDetailSkeleton } from '../skeleton/activity-detail-skeleton';
import { Navigate, useParams } from 'react-router-dom';
import { ActivityDetailHeader } from './activity-detail-header';
import { ActivityDetailInfo } from './activity-detail-info';
import { ActivityDetailChat } from './activity-detail-chat';
import { ActivityDetailSidebar } from './activity-detail-sidebar';

export const ActivityDetailPage = () => {
  const { id } = useParams();
  const { activity, isActivityLoading } = useActivities(id);
  if (isActivityLoading) return <ActivityDetailSkeleton />;
  if (!id || !activity) return <Navigate to={'/activities'} />;

  return (
    <div className='container mx-auto px-4 py-6 mt-20'>
      <ActivityDetailHeader activity={activity} />
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='md:col-span-2'>
          <ActivityDetailInfo activity={activity} />
          <ActivityDetailChat />
        </div>
        <div className='md:col-span-1'>
          <ActivityDetailSidebar activity={activity} />
        </div>
      </div>
    </div>
  );
};
