import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { activitySchema } from '@/lib/validations/activity.schema';
import { InputField } from '@/components/fields/input-field';
import { TextareaField } from '@/components/fields/textarea-field';
import { Button } from '@/components/ui/button';
import { DatePickerField } from '@/components/fields/date-picker-field';
import { Activity } from '@/lib/interfaces/activity';
import { useActivities } from '@/lib/hooks/useActivities';
import { useNavigate, useParams } from 'react-router-dom';
import { SelectField } from '@/components/fields/select-field';
import { categoryOptions } from './catergory-options';
import { LocationInputField } from '@/components/fields/location-input-field';

export const ActivityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateActivity, createActivity, activity, isActivityLoading } =
    useActivities(id);
  const form = useForm<z.infer<typeof activitySchema>>({
    resolver: zodResolver(activitySchema),
    mode: 'onTouched',
    defaultValues: activity
      ? {
          ...activity,
          location: {
            city: activity.city,
            venue: activity.venue,
            latitude: activity.latitude || 0,
            longitude: activity.longitude || 0,
          },
          date: new Date(activity.date),
        }
      : {
          title: '',
          description: '',
          category: '',
          location: {
            city: '',
            venue: '',
            latitude: 0,
            longitude: 0,
          },
        },
  });
  const onSubmit = async (data: z.infer<typeof activitySchema>) => {
    const { location, ...rest } = data;
    const params = {
      ...rest,
      ...location,
    } as Activity;
    try {
      if (activity) {
        params.id = activity.id;
        await updateActivity.mutateAsync(params, {
          onSuccess: () => {
            navigate(`/activities/${params.id}`);
          },
        });
      } else {
        createActivity.mutate(params, {
          onSuccess: (id) => navigate(`/activities/${id}`),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  if (isActivityLoading) return <></>;

  return (
    <Card className='mt-20'>
      <CardHeader>
        <CardTitle>{activity ? 'Edit' : 'Create'} Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
            <InputField form={form} id='title' label='Title' />
            <TextareaField form={form} id='description' label='Description' />
            <div className='flex gap-2 mb-4'>
              <SelectField
                form={form}
                id='category'
                label='Category'
                items={categoryOptions}
                placeholder='Select a category'
                className='w-full'
              />
              <DatePickerField
                form={form}
                id='date'
                label='Date'
                defaultValue={form.watch('date')}
                className='w-full'
                dateLimit={
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() + 20)
                  )
                }
              />
            </div>

            {/* <InputField form={form} id='city' label='City' />
            <InputField form={form} id='venue' label='Venue' /> */}
            <LocationInputField
              form={form}
              id='location'
              label='Enter the location'
            />
            <div className='flex gap-2 justify-end items-center'>
              <Button
                type='button'
                onClick={() => form.reset()}
                variant='ghost'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={updateActivity.isPending || createActivity.isPending}
              >
                {activity ? 'Save' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
