import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { UsersIcon } from '@/components/ui/users';
import { Profile } from '@/lib/interfaces/activity';
import { Link } from 'react-router-dom';

interface Props {
  profile: Profile;
}

export const ProfileCard = ({ profile }: Props) => {
  const following = false;
  return (
    <Link to={`/profile/${profile.id}`}>
      <div className='flex justify-between space-x-4'>
        <Avatar className='size-20'>
          <AvatarImage
            src={profile.imageUrl || 'https://github.com/shadcn.png'}
          />
          <AvatarFallback>{profile.displayName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className='space-y-1 w-full'>
          <h5 className='text-sm font-semibold'>{profile.displayName}</h5>
          {following && <Badge variant='secondary'>Following</Badge>}
          <Separator />
          <div className='flex items-center space-x-1'>
            <UsersIcon size={16} />
            <span className='text-sm font-medium'>20 followers</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
