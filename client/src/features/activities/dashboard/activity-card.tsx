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
import { AvatarHoverCard } from '@/components/shared/avatar-hover-card';

interface Props {
  activity: Activity;
}
export const ActivityCard = ({ activity }: Props) => {
  const label = activity.isHost
    ? 'You are hosting this activity'
    : activity.isGoing
    ? 'You are going'
    : 'Join Activity';

  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-3'>
          <Avatar className='size-15'>
            <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className='flex justify-between w-full'>
            <div>
              <CardTitle>{activity.title}</CardTitle>
              <p>
                Hosted by{' '}
                <Link
                  className='font-semibold hover:underline'
                  to={`/profile/${activity.hostId}`}
                >
                  {activity.hostDisplayName}
                </Link>
              </p>
            </div>
            <CardDescription className='flex flex-col items-end gap-1'>
              {(activity.isHost || activity.isGoing) && (
                <Badge
                  className='block mt-2'
                  variant={activity.isHost ? 'default' : 'outline'}
                >
                  {label}
                </Badge>
              )}
              {activity.isCancelled && (
                <Badge variant='destructive'>Cancelled</Badge>
              )}
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
      <div className='bg-primary-foreground p-5 flex'>
        {activity.attendees.map((a) => (
          <Link key={a.id} to={`/profile/${a.id}`} className='mr-[-10px]'>
            <AvatarHoverCard profile={a} />
          </Link>
        ))}
      </div>
      <CardFooter className='flex justify-between'>
        <Badge variant='secondary'>{activity.category}</Badge>
        <Button onClick={() => navigate(`/activities/${activity.id}`)}>
          View
        </Button>
      </CardFooter>
    </Card>
  );
};
