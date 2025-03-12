import { Map } from '@/components/shared/map';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity } from '@/lib/interfaces/activity';
import { TabsContent } from '@radix-ui/react-tabs';
import { format } from 'date-fns';
import { Calendar, Info, MapPin } from 'lucide-react';

interface Props {
  activity: Activity;
}
export const ActivityDetailInfo = ({ activity }: Props) => {
  return (
    <Tabs defaultValue='description' className='w-full'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='description'>Description</TabsTrigger>
        <TabsTrigger value='map'>Map</TabsTrigger>
      </TabsList>
      <TabsContent value='description'>
        <Card className='mb-4'>
          <CardContent className='p-0'>
            <div className='flex gap-2 items-center pl-4 py-3'>
              <Info className='size-5 ' />
              <p>{activity.description}</p>
            </div>
            <Separator />
            <div className='flex gap-2 items-center pl-4 py-3'>
              <Calendar className='size-5 ' />
              <p>{format(new Date(activity.date), 'PPpp')}</p>
            </div>
            <Separator />
            <div className='flex gap-2 items-center pl-4 py-3'>
              <MapPin className='size-5 ' />
              <p>
                {activity.venue}, {activity.city}
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value='map'>
        <Card className='mb-4'>
          <CardContent className='space-y-2 h-[400px] z-[1000] block'>
            <Map
              position={[activity.latitude, activity.longitude]}
              venue={activity.venue}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
