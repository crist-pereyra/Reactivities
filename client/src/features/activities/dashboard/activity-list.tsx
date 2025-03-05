import { Activity } from '@/app/interfaces/activity';
import { ActivityCard } from './activity-card';

interface Props {
  activities: Activity[];
}
export const ActivityList = ({ activities }: Props) => {
  return (
    <div className='flex flex-col gap-3 p-6 mt-14'>
      {activities.map((activity) => (
        <ActivityCard activity={activity} key={activity.id} />
      ))}
    </div>
  );
};
