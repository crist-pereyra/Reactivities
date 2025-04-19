import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useProfile } from '@/lib/hooks/useProfile';
import { useParams } from 'react-router-dom';

export const ProfileHeader = () => {
  const { id } = useParams();
  const { isCurrentUser, profile, updateFollowing } = useProfile(id);

  if (!profile) return <></>;
  return (
    <Card className='p-4 rounded-md flex'>
      <div className='flex flex-col md:flex-row gap-6 items-start'>
        <Avatar className='h-24 w-24 bg-muted'>
          <AvatarImage
            src={profile.imageUrl || 'https://github.com/shadcn.png'}
            alt={profile.displayName}
          />
          <AvatarFallback className='text-4xl'>{'U'}</AvatarFallback>
        </Avatar>

        <div className='flex-1'>
          <h2 className='text-2xl font-medium mb-2'>{profile.displayName}</h2>
          <div className='mb-4'>
            {profile.following && <Badge>Following</Badge>}
          </div>
        </div>

        <div className='flex flex-col md:flex-row gap-8 items-center'>
          <div className='text-center'>
            <p className='text-muted-foreground text-sm'>Followers</p>
            <p className='text-4xl font-bold'>{profile.followersCount}</p>
          </div>
          <div className='text-center'>
            <p className='text-muted-foreground text-sm'>Following</p>
            <p className='text-4xl font-bold'>{profile.followingCount}</p>
          </div>
        </div>
      </div>

      {!isCurrentUser && (
        <div className='mt-4 flex justify-end'>
          <Button
            variant='outline'
            className={
              profile.following
                ? 'w-full md:w-auto text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600'
                : 'w-full md:w-auto'
            }
            onClick={() => updateFollowing.mutate()}
            disabled={updateFollowing.isPending}
          >
            {profile.following ? 'Unfollow' : 'Follow'}
          </Button>
        </div>
      )}
    </Card>
  );
};
