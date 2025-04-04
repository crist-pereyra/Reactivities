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
  CardFooter,
} from '@/components/ui/card';
import { ProfilePhotos } from './profile-photos';
import { ProfileAbout } from './profile-about';

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
            <CardFooter>{/* <Button>Change password</Button> */}</CardFooter>
          </Card>
        </VerticalTabsContent>

        <VerticalTabsContent value='events'>
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure how you receive notifications and alerts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Notification settings content goes here.</p>
            </CardContent>
          </Card>
        </VerticalTabsContent>

        <VerticalTabsContent value='followers'>
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the appearance of the application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Appearance settings content goes here.</p>
            </CardContent>
          </Card>
        </VerticalTabsContent>

        <VerticalTabsContent value='following'>
          <Card>
            <CardHeader>
              <CardTitle>Display</CardTitle>
              <CardDescription>
                Manage your display preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Display settings content goes here.</p>
            </CardContent>
          </Card>
        </VerticalTabsContent>
      </VerticalTabs>
    </>
  );
};
