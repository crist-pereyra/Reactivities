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
import { Link, Navigate, useParams } from 'react-router-dom';

export const ActivityDetail = () => {
  const { id } = useParams();
  const { activity, isActivityLoading } = useActivities(id);
  if (isActivityLoading) return <ActivityDetailSkeleton />;
  if (!id || !activity) return <Navigate to={'/activities'} />;

  return (
    <Card className='pt-0 overflow-hidden mt-20'>
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
        <Button asChild>
          <Link to={`/manage/${activity.id}`}>Edit</Link>
        </Button>
        <Button variant='destructive' asChild>
          <Link to={'/activities'}>Cancel</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
