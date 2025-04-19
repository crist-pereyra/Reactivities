import { useParams } from 'react-router-dom';
import { ProfileContent } from './profile-content';
import { ProfileHeader } from './profile-header';
import { useProfile } from '@/lib/hooks/useProfile';
import { ProfileSkeletonPage } from './profile-skeleton-page';

export const ProfilePage = () => {
  const { id } = useParams();
  const { profile, isLoadingProfile } = useProfile(id);

  if (isLoadingProfile) return <ProfileSkeletonPage />;
  if (!profile) return <div className='mt-20'>Profile not found</div>;
  return (
    <div className='mt-20'>
      <ProfileHeader />
      <ProfileContent />
    </div>
  );
};
