import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useActivities } from '@/lib/hooks/useActivities';
import { Activity } from '@/lib/interfaces/activity';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface Props {
  activity: Activity;
}
export const ActivityDetailHeader = ({ activity }: Props) => {
  const { updateAttendance } = useActivities(activity.id);

  return (
    <div className='relative mb-4 rounded-lg overflow-hidden'>
      {activity.isCancelled && (
        <Badge
          variant='destructive'
          className='absolute left-10 top-5 z-50 px-3 py-1 text-sm'
        >
          Cancelled
        </Badge>
      )}
      <div className='relative h-[300px] w-full' style={{ perspective: '1px' }}>
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{
            backgroundImage: `url(/images/category-images/${activity.category}.jpg)`,
            backgroundAttachment: 'fixed',
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
        />
      </div>
      <div className='absolute bottom-0 w-full text-white p-4 flex flex-row justify-between items-end bg-gradient-to-t from-black/80 to-transparent'>
        {/* Text Section */}
        <div className='mt-20'>
          <h4 className='text-2xl font-bold'>{activity.title}</h4>
          <p className='text-sm'>{format(activity.date, 'dd/MM/yyyy HH:mm')}</p>
          <p className='text-xs'>
            Hosted by{' '}
            <Link
              to={`/profile/${activity.hostId}`}
              className='text-white font-bold hover:underline'
            >
              {activity.hostDisplayName}
            </Link>
          </p>
        </div>

        {/* Buttons aligned to the right */}
        <div className='flex gap-2'>
          {activity.isHost ? (
            <>
              <Button
                variant={activity.isCancelled ? 'default' : 'destructive'}
                onClick={() => updateAttendance.mutate(activity.id)}
                disabled={updateAttendance.isPending}
              >
                {activity.isCancelled
                  ? 'Re-activate Activity'
                  : 'Cancel Activity'}
              </Button>
              <Button
                variant='secondary'
                asChild
                disabled={activity.isCancelled}
              >
                <Link to={activity.isCancelled ? '' : `/manage/${activity.id}`}>
                  Manage Event
                </Link>
              </Button>
            </>
          ) : (
            <Button
              variant={activity.isGoing ? 'default' : 'secondary'}
              onClick={() => updateAttendance.mutate(activity.id)}
              disabled={updateAttendance.isPending || activity.isCancelled}
            >
              {activity.isGoing ? 'Cancel Attendance' : 'Join Activity'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
