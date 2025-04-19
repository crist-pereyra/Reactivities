import { ProfileCard } from '@/features/profiles/profile-card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card';
import { Profile } from '@/lib/interfaces/activity';

interface Props {
  profile: Profile;
}
export const AvatarHoverCard = ({ profile }: Props) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Avatar>
          <AvatarImage
            src={profile.imageUrl || 'https://github.com/shadcn.png'}
            alt={profile.displayName}
            className={`${
              profile.following ? 'border-3 border-primary rounded-full' : ''
            }`}
          />
          <AvatarFallback>{profile.displayName}</AvatarFallback>
        </Avatar>
      </HoverCardTrigger>
      <HoverCardContent className='w-80'>
        <ProfileCard profile={profile} />
      </HoverCardContent>
    </HoverCard>
  );
};
