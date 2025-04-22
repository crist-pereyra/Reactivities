import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfile } from '@/lib/hooks/useProfile';
import { Activity } from '@/lib/interfaces/activity';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { format } from 'date-fns';

export const ProfileActivities = () => {
  const { id } = useParams();
  const { userActivities, setFilter, filter } = useProfile(id);
  useEffect(() => {
    setFilter('future');
  }, [setFilter]);
  return (
    <Tabs
      value={filter ?? 'future'}
      onValueChange={(value) => setFilter(value)}
    >
      <TabsList className='grid w-full grid-cols-3'>
        <TabsTrigger value='future'>Future Events</TabsTrigger>
        <TabsTrigger value='past'>Past Events</TabsTrigger>
        <TabsTrigger value='hosting'>Hosting</TabsTrigger>
      </TabsList>
      <TabsContent value='future' className='grid grid-cols-4 gap-3 mt-2'>
        <ProfileActivitiesList activities={userActivities ?? []} />
      </TabsContent>
      <TabsContent value='past' className='grid grid-cols-4 gap-3 mt-2'>
        <ProfileActivitiesList activities={userActivities ?? []} />
      </TabsContent>
      <TabsContent value='hosting' className='grid grid-cols-4 gap-3 mt-2'>
        <ProfileActivitiesList activities={userActivities ?? []} />
      </TabsContent>
    </Tabs>
  );
};

interface Props {
  activities: Activity[];
}
const ProfileActivitiesList = ({ activities }: Props) => {
  return (
    <>
      {activities.map((activity) => (
        <Link to={`/activities/${activity.id}`} key={activity.id}>
          <Card className='pt-0 overflow-hidden'>
            <img
              src={`/images/category-images/${activity.category}.jpg`}
              alt={activity.title}
              className='h-28 w-full object-cover'
            />
            <CardHeader>
              <CardTitle className='text-center'>{activity.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className='flex flex-col items-center'>
                <span>{format(activity.date, 'do LLL yyyy')}</span>
                <span>{format(activity.date, 'h:mm a')}</span>
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      ))}
    </>
  );
};
