import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const ServerError = () => {
  const { state } = useLocation();

  return (
    <section className='flex min-h-[70vh] items-center justify-center p-4 mt-20'>
      <Card className='mx-auto shadow-lg border-destructive/20'>
        <CardHeader className='space-y-1'>
          <div className='flex items-center gap-2'>
            <div className='rounded-full bg-destructive/15 p-2'>
              <AlertCircle className='h-5 w-5 text-destructive' />
            </div>
            <CardTitle className='text-xl font-bold'>Server Error</CardTitle>
            {state?.error?.code && (
              <Badge variant='outline' className='ml-auto'>
                Code: {state.error.code}
              </Badge>
            )}
          </div>
        </CardHeader>

        {state?.error ? (
          <>
            <CardContent className='space-y-4'>
              <div className='rounded-md bg-muted p-3'>
                <h3 className='font-medium text-lg'>
                  {state.error?.message || 'There has been an error'}
                </h3>
                <Separator className='my-3' />
                <p className='text-muted-foreground'>
                  {state.error?.details || 'Internal server error'}
                </p>
              </div>

              {state.error?.timestamp && (
                <div className='text-xs text-muted-foreground'>
                  Error occurred at:{' '}
                  {new Date(state.error.timestamp).toLocaleString()}
                </div>
              )}
            </CardContent>
          </>
        ) : (
          <CardContent className='text-center py-8'>
            <div className='rounded-full bg-destructive/10 p-3 inline-flex mx-auto mb-4'>
              <AlertCircle className='h-6 w-6 text-destructive' />
            </div>
            <p className='text-lg font-medium'>Server error</p>
            <p className='text-sm text-muted-foreground mt-1'>
              An unexpected error has occurred
            </p>
          </CardContent>
        )}
      </Card>
    </section>
  );
};
