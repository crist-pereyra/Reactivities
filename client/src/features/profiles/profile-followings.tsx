import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useProfile } from '@/lib/hooks/useProfile';
import { useParams } from 'react-router-dom';
import { ProfileCard } from './profile-card';

interface Props {
  predicate: string;
}
export const ProfileFollowings = ({ predicate }: Props) => {
  const { id } = useParams();
  const { profile, followings, isLoadingFollowings } = useProfile(
    id,
    predicate
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {predicate === 'followers'
            ? `People following ${profile?.displayName}`
            : `People followed by ${profile?.displayName}`}
        </CardTitle>
        <CardDescription>
          {predicate === 'followers'
            ? 'View followers profile.'
            : 'View followed profile.'}
        </CardDescription>
      </CardHeader>
      <CardContent className='grid grid-cols-3 gap-3'>
        {isLoadingFollowings ? (
          <p>Loading...</p>
        ) : followings?.length === 0 ? (
          <p>No followings found.</p>
        ) : (
          followings?.map((profile) => (
            <Card key={profile.id} className='p-4'>
              <ProfileCard profile={profile} />
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};
