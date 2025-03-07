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
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Clock, MapPin } from 'lucide-react';

interface Props {
  activity: Activity;
}
export const ActivityCard = ({ activity }: Props) => {
  const isHost = false;
  const isGoing = false;
  const label = isHost
    ? 'You are hosting this activity'
    : isGoing
    ? 'You are going'
    : 'Join Activity';
  const isCancelled = false;
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-3'>
          <Avatar className='size-15'>
            <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{activity.title}</CardTitle>
            <CardDescription>
              Hosted by{' '}
              <Link
                className='font-semibold hover:underline'
                to={'/profile/shadcn'}
              >
                Shadcn
              </Link>
              <Badge
                className='block mt-2'
                variant={
                  isCancelled ? 'destructive' : isGoing ? 'outline' : 'default'
                }
              >
                {label}
              </Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className='flex gap-3'>
        <div className='flex gap-1 items-center'>
          <Clock className='mr-2 h-4 w-4' />{' '}
          <p>{format(activity.date, 'dd MMM yyyy HH:mm a')}</p>
        </div>
        <div className='flex gap-1 items-center'>
          <MapPin className='mr-2 h-4 w-4' />
          {/* salto de linea */}
          <p>{activity.city}</p>
        </div>
      </CardContent>
      <div className='bg-primary-foreground p-5'>Attendees go here</div>
      <CardFooter className='flex justify-between'>
        <Badge variant='secondary'>{activity.category}</Badge>
        <Button onClick={() => navigate(`/activities/${activity.id}`)}>
          View
        </Button>
      </CardFooter>
    </Card>
  );
};
