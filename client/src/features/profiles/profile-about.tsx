import { Button } from '@/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useProfile } from '@/lib/hooks/useProfile';
import { useParams } from 'react-router-dom';

export const ProfileAbout = () => {
  const { id } = useParams();
  const { profile } = useProfile(id);
  return (
    <>
      <CardHeader>
        <div className='flex justify-between'>
          <CardTitle>About {profile?.displayName}</CardTitle>
          <Button>Edit profile</Button>
        </div>
        <Separator className='my-2' />
        <CardDescription className='whitespace-pre-wrap'>
          {profile?.bio || 'No description added yet.'}
        </CardDescription>
      </CardHeader>
    </>
  );
};
