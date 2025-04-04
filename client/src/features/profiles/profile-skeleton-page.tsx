import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ProfileSkeletonPage = () => {
  return (
    <div className='w-full max-w-6xl mx-auto p-4 space-y-4 mt-20'>
      {/* Profile Header Card */}
      <Card className='w-full'>
        <CardContent className='p-6'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
            {/* Profile Avatar */}
            <Skeleton className='h-20 w-20 rounded-full' />

            {/* Profile Info */}
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-8 w-48' />
              <div className='flex items-center gap-2'>
                <Skeleton className='h-8 w-24' />
              </div>
            </div>

            {/* Stats */}
            <div className='flex gap-6 ml-auto'>
              <div className='text-center'>
                <Skeleton className='h-4 w-20 mx-auto mb-2' />
                <Skeleton className='h-8 w-12 mx-auto' />
              </div>
              <div className='text-center'>
                <Skeleton className='h-4 w-20 mx-auto mb-2' />
                <Skeleton className='h-8 w-12 mx-auto' />
              </div>
            </div>

            {/* Action Button */}
            <div>
              <Skeleton className='h-9 w-24' />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <div className='flex flex-col md:flex-row gap-4'>
        {/* Sidebar */}
        <Card className='w-full md:w-64 shrink-0'>
          <CardContent className='p-4 space-y-4'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className='h-10 w-full' />
            ))}
          </CardContent>
        </Card>

        {/* Main Content - Making this card longer as requested */}
        <Card className='w-full flex-1'>
          <CardHeader>
            <Skeleton className='h-8 w-48 mb-2' />
            <Skeleton className='h-4 w-full max-w-md' />
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Making this card longer with more skeleton items */}
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-5/6' />
            <Skeleton className='h-4 w-4/6' />
            <Skeleton className='h-20 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-32 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-2/3' />
            <Skeleton className='h-4 w-5/6' />
            <Skeleton className='h-20 w-full' />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
