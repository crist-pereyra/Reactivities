import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const ActivityDetailSidebar = () => {
  const following = true;
  const isHost = true;

  return (
    <>
      <div className='text-center bg-primary text-primary-foreground p-4 rounded-t-lg'>
        <h6 className='text-lg font-medium'>2 people going</h6>
      </div>
      <Card className='rounded-t-none'>
        <CardContent className='p-4'>
          <div className='grid grid-cols-12 items-center'>
            <div className='col-span-8'>
              <div className='flex flex-col'>
                <div className='flex items-center'>
                  <Avatar className='mr-3'>
                    <AvatarImage
                      src='https://github.com/shadcn.png'
                      alt='Attendee'
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <h6 className='text-base font-semibold'>Bob</h6>
                </div>
              </div>
            </div>
            <div className='col-span-4 flex flex-col items-end gap-1'>
              {isHost && (
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
        </CardContent>
      </Card>
    </>
  );
};
