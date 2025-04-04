import { MasonryImageList } from '@/components/shared/masonry-image-list';
import { PhotoUploadWidget } from '@/components/shared/photo-upload-widget';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfile } from '@/lib/hooks/useProfile';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export const ProfilePhotos = () => {
  const [activeTab, setActiveTab] = useState('photos');
  const { id } = useParams();
  const {
    photos,
    isLoadingPhotos,
    isCurrentUser,
    uploadPhoto,
    profile,
    setMainPhoto,
    deletePhoto,
  } = useProfile(id);
  const handlePhotoUpload = (file: Blob) =>
    uploadPhoto.mutate(file, {
      onSuccess: () => setActiveTab('photos'),
    });

  if (isLoadingPhotos) return <div>Loading photos...</div>;
  if (!photos) return <div>No photos found for this profile. 🔎</div>;
  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {isCurrentUser && (
          <TabsList>
            <TabsTrigger value='photos'>Photos</TabsTrigger>
            <TabsTrigger value='add-photo'>Add Photo</TabsTrigger>
          </TabsList>
        )}
        <TabsContent value='photos'>
          {photos.length === 0 ? (
            <div>No photos found for this profile. 🔎</div>
          ) : (
            <MasonryImageList
              photos={photos}
              isCurrentUser={isCurrentUser}
              profile={profile}
              setMainPhoto={setMainPhoto}
              deletePhoto={deletePhoto}
            />
          )}
        </TabsContent>
        <TabsContent value='add-photo'>
          <PhotoUploadWidget
            uploadPhoto={handlePhotoUpload}
            isPending={uploadPhoto.isPending}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};
