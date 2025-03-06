import { Activity } from '@/lib/interfaces/activity';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useActivities } from '@/lib/hooks/useActivities';
import { format } from 'date-fns';
import { ActivityDetailSkeleton } from '../skeleton/activity-detail-skeleton';
import { useActivityStore } from '@/lib/stores/activity.store';

interface Props {
  selectedActivity: Activity;
}
export const ActivityDetail = ({ selectedActivity }: Props) => {
  const handleCancelSelectActivity = useActivityStore(
    (state) => state.handleCancelSelectActivity
  );
  const handleOpenForm = useActivityStore((state) => state.handleOpenForm);
  const { activities } = useActivities();
  const activity = activities?.find((a) => a.id === selectedActivity.id);
  if (!activity) return <ActivityDetailSkeleton />;
  return (
    <Card className='pt-0 overflow-hidden'>
      <img
        src={`/images/category-images/${activity.category}.jpg`}
        alt={activity.title}
        className='h-48 w-full object-cover'
      />
      <CardHeader>
        <CardTitle>{activity.title}</CardTitle>
        <CardDescription>
          {format(activity.date, 'dd/MM/yyyy HH:mm')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{activity.description}</p>
      </CardContent>
      <CardFooter className='flex justify-between'>
        <Button onClick={() => handleOpenForm(activity.id)}>Edit</Button>
        <Button variant='destructive' onClick={handleCancelSelectActivity}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};
