import { Activity } from '@/app/interfaces/activity';
import { useActivityStore } from '@/app/stores/activity.store';
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
export const ActivityDetail = ({ activity }: Props) => {
  const handleCancelSelectActivity = useActivityStore(
    (state) => state.handleCancelSelectActivity
  );
  const handleOpenForm = useActivityStore((state) => state.handleOpenForm);
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
