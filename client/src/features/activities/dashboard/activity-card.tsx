import { Activity } from '@/app/interfaces/activity';
import { useActivityStore } from '@/app/stores/activity.store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';

interface Props {
  activity: Activity;
}
export const ActivityCard = ({ activity }: Props) => {
  const handleSelectActivity = useActivityStore(
    (state) => state.handleSelectActivity
  );
  const handleDeleteActivity = useActivityStore(
    (state) => state.handleDeleteActivity
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>{activity.title}</CardTitle>
        <CardDescription>
          {format(activity.date, 'dd/MM/yyyy HH:mm')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{activity.description}</p>
        <p className='text-lg'>
          {activity.city} / {activity.venue}
        </p>
      </CardContent>
      <CardFooter className='flex justify-between'>
        <Badge>{activity.category}</Badge>
        <div className='flex gap-2'>
          <Button onClick={() => handleSelectActivity(activity.id)}>
            View
          </Button>
          <Button
            variant='destructive'
            onClick={() => handleDeleteActivity(activity.id)}
          >
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
