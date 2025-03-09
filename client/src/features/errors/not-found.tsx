import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Compass, Home, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4'>
      <div className='space-y-6 text-center'>
        <div className='space-y-2'>
          <h1 className='text-9xl font-bold tracking-tighter text-primary'>
            404
          </h1>
          <div className='flex items-center justify-center space-x-2'>
            <div className='h-px w-8 bg-muted-foreground/50' />
            <p className='text-xl text-muted-foreground'>Page not found</p>
            <div className='h-px w-8 bg-muted-foreground/50' />
          </div>
        </div>

        <div className='relative flex h-40 w-40 items-center justify-center mx-auto'>
          <div className='absolute animate-spin-slow h-40 w-40 rounded-full border-t-2 border-primary' />
          <div className='absolute animate-spin-slow animation-delay-500 h-32 w-32 rounded-full border-r-2 border-secondary' />
          <div className='absolute animate-bounce h-24 w-24 rounded-full bg-primary/10 backdrop-blur-sm' />
          <Compass className='h-12 w-12 text-primary' />
        </div>

        <p className='max-w-[600px] text-muted-foreground'>
          We've searched everywhere, but the page you're looking for seems to
          have wandered off into the digital wilderness.
        </p>
      </div>

      <Card className='mt-8 w-full max-w-md border-muted-foreground/20'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Sparkles className='h-5 w-5 text-primary' />
            What would you like to do?
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-2'>
            <Button asChild className='w-full justify-start'>
              <Link to='/activities'>
                <Compass className='mr-2 h-4 w-4' />
                Go to Activities
              </Link>
            </Button>
            <Button asChild variant='outline' className='w-full justify-start'>
              <Link to='/'>
                <Home className='mr-2 h-4 w-4' />
                Return to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
