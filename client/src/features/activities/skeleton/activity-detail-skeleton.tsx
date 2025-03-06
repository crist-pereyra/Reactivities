import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ActivityDetailSkeleton = () => {
  return (
    <Card className='pt-0 overflow-hidden'>
      {/* Image placeholder */}
      <Skeleton className='h-48 w-full' />

      <CardHeader>
        <CardTitle>
          <Skeleton className='h-6 w-3/4' />
        </CardTitle>
        <CardDescription>
          <Skeleton className='h-4 w-1/3 mt-2' />
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Skeleton className='h-4 w-full mb-2' />
        <Skeleton className='h-4 w-full mb-2' />
        <Skeleton className='h-4 w-4/5' />
      </CardContent>

      <CardFooter className='flex justify-between'>
        <Skeleton className='h-10 w-16' />
        <Skeleton className='h-10 w-16' />
      </CardFooter>
    </Card>
  );
};
