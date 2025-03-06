import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ActivityCardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className='h-6 w-3/4' />
        </CardTitle>
        <CardDescription>
          <Skeleton className='h-4 w-1/3 mt-2' />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className='h-4 w-full mb-4' />
        <Skeleton className='h-4 w-full mb-4' />
        <Skeleton className='h-6 w-2/3' />
      </CardContent>
      <CardFooter className='flex justify-between'>
        <Skeleton className='h-6 w-20' />
        <div className='flex gap-2'>
          <Skeleton className='h-10 w-16' />
          <Skeleton className='h-10 w-16' />
        </div>
      </CardFooter>
    </Card>
  );
};
