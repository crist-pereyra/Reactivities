import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Activity } from '@/lib/interfaces/activity';

interface Props {
  activity: Activity;
}

export const ActivityDetailSidebar = ({ activity }: Props) => {
  const following = true;

  return (
    <>
      <div className='text-center bg-primary text-primary-foreground p-4 rounded-t-lg'>
        <h6 className='text-lg font-medium'>
          {activity.attendees.length} people going
        </h6>
      </div>
      <Card className='rounded-t-none'>
        <CardContent className='p-4'>
          <div className=''>
            {activity.attendees.map((attendee) => (
              <div
                className='flex justify-between items-center p-2 hover:bg-muted/80 rounded'
                key={attendee.id}
              >
                <div className='flex flex-col'>
                  <div className='flex items-center'>
                    <Avatar className='mr-3 size-16'>
                      <AvatarImage
                        src={
                          attendee?.imageUrl || 'https://github.com/shadcn.png'
                        }
                        alt={attendee.displayName}
                      />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <h6 className='text-base font-semibold'>
                      {attendee.displayName}
                    </h6>
                  </div>
                </div>
                <div className='col-span-4 flex flex-col items-end gap-1'>
                  {activity.hostId === attendee.id && (
                    <Badge
                      variant='outline'
                      className='bg-amber-500 text-white border-none rounded-full'
                    >
                      Host
                    </Badge>
                  )}
                  {following && (
                    <p className='text-sm text-orange-500'>Following</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
