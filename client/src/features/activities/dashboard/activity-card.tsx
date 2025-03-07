import { Activity } from '@/lib/interfaces/activity';
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
import { useActivities } from '@/lib/hooks/useActivities';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface Props {
  activity: Activity;
}
export const ActivityCard = ({ activity }: Props) => {
  const navigate = useNavigate();
  const { deleteActivity } = useActivities();
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
          <Button onClick={() => navigate(`/activities/${activity.id}`)}>
            View
          </Button>
          <Button
            variant='destructive'
            onClick={() => deleteActivity.mutate(activity.id)}
            disabled={deleteActivity.isPending}
          >
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
