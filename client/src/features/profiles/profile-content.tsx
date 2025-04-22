import {
  VerticalTabs,
  VerticalTabsContent,
  VerticalTabsList,
  VerticalTabsTrigger,
} from '@/components/shared/vertical-tabs';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { ProfilePhotos } from './profile-photos';
import { ProfileAbout } from './profile-about';
import { ProfileFollowings } from './profile-followings';
import { ProfileActivities } from './profile-activities';

export const ProfileContent = () => {
  return (
    <>
      <VerticalTabs defaultValue='about' className='min-h-[400px] mt-4'>
        <VerticalTabsList>
          <VerticalTabsTrigger value='about'>About</VerticalTabsTrigger>
          <VerticalTabsTrigger value='photos'>Photos</VerticalTabsTrigger>
          <VerticalTabsTrigger value='events'>Events</VerticalTabsTrigger>
          <VerticalTabsTrigger value='followers'>Followers</VerticalTabsTrigger>
          <VerticalTabsTrigger value='following'>Following</VerticalTabsTrigger>
        </VerticalTabsList>

        <VerticalTabsContent value='about'>
          <Card>
            <ProfileAbout />
          </Card>
        </VerticalTabsContent>

        <VerticalTabsContent value='photos'>
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
              <CardDescription>
                View and manage your profile photos.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <ProfilePhotos />
            </CardContent>
          </Card>
        </VerticalTabsContent>

        <VerticalTabsContent value='events'>
          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
              <CardDescription>View the events.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileActivities />
            </CardContent>
          </Card>
        </VerticalTabsContent>

        <VerticalTabsContent value='followers'>
          <ProfileFollowings predicate='followers' />
        </VerticalTabsContent>

        <VerticalTabsContent value='following'>
          <ProfileFollowings predicate='followings' />
        </VerticalTabsContent>
      </VerticalTabs>
    </>
  );
};
