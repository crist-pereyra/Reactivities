import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Activity } from '@/lib/interfaces/activity';
import { format } from 'date-fns';
import { Calendar, Info, MapPin } from 'lucide-react';
interface Props {
  activity: Activity;
}
export const ActivityDetailInfo = ({ activity }: Props) => {
  return (
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
  );
};
