import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';

export const ActivityDetailChat = () => {
  return (
    <>
      <div className='text-center bg-primary text-primary-foreground p-4 rounded-t-lg'>
        <h6 className='text-lg font-medium'>Chat about this event</h6>
      </div>
      <Card className='rounded-t-none'>
        <CardContent className='p-4'>
          <div>
            <form>
              <Textarea
                className='w-full'
                rows={2}
                placeholder='Enter your comment (Enter to submit, SHIFT + Enter for new line)'
              />
            </form>
          </div>

          <div>
            <div className='flex my-4'>
              <Avatar className='mr-3'>
                <AvatarImage src='https://github.com/shadcn.png' alt='User' />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <div className='flex items-center gap-3'>
                  <Link
                    to={`/profiles/username`}
                    className='font-bold text-sm no-underline hover:underline'
                  >
                    Bob
                  </Link>
                  <span className='text-xs text-muted-foreground'>
                    2 hours ago
                  </span>
                </div>

                <p className='whitespace-pre-wrap'>Comment goes here</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
