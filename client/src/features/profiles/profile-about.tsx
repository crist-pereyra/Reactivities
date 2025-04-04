import { InputField } from '@/components/fields/input-field';
import { TextareaField } from '@/components/fields/textarea-field';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfile } from '@/lib/hooks/useProfile';
import {
  EditProfileSchema,
  editProfileSchema,
} from '@/lib/validations/edit-profile.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

export const ProfileAbout = () => {
  const { id } = useParams();
  const { profile, isCurrentUser, updateProfile } = useProfile(id);
  const form = useForm<EditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    mode: 'onTouched',
    defaultValues: {
      displayName: profile?.displayName,
      bio: profile?.bio || '',
    },
  });
  const onSubmit = (data: EditProfileSchema) => {
    updateProfile.mutate(data, {
      onSuccess: () => toast.success('Profile updated successfully!'),
    });
  };

  return (
    <>
      <CardHeader>
        <div className='flex justify-between'>
          <CardTitle>About {profile?.displayName}</CardTitle>
        </div>
        <Separator className='my-2' />
      </CardHeader>
      <CardContent className='space-y-4'>
        <Tabs defaultValue='bio'>
          {isCurrentUser && (
            <TabsList>
              <TabsTrigger value='bio'>Bio</TabsTrigger>
              <TabsTrigger value='edit-bio'>Edit Profile</TabsTrigger>
            </TabsList>
          )}
          <TabsContent value='bio'>
            <p className='whitespace-pre-wrap'>
              {profile?.bio || 'No description added yet.'}
            </p>
          </TabsContent>
          <TabsContent value='edit-bio'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-2'
              >
                <InputField form={form} id='displayName' label='Display Name' />
                <TextareaField
                  form={form}
                  id='bio'
                  label='Bio'
                  maxLength={1000}
                  isVisibleCounter
                />
                <div className='flex gap-2 justify-end items-center'>
                  <Button
                    type='button'
                    onClick={() => form.reset()}
                    variant='ghost'
                  >
                    Cancel
                  </Button>
                  <Button type='submit'>Save</Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </>
  );
};
