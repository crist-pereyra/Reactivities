import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { activitySchema } from '@/app/validations/activity.schema';
import { InputField } from '@/components/fields/input-field';
import { TextareaField } from '@/components/fields/textarea-field';
import { Button } from '@/components/ui/button';
import { DatePickerField } from '@/components/fields/date-picker-field';
import { useActivityStore } from '@/app/stores/activity.store';
import { Activity } from '@/app/interfaces/activity';

export const ActivityForm = () => {
  const handleCloseForm = useActivityStore((state) => state.handleCloseForm);
  const selectedActivity = useActivityStore((state) => state.selectedActivity);
  const handleSubmitForm = useActivityStore((state) => state.handleSubmitForm);
  const form = useForm<z.infer<typeof activitySchema>>({
    resolver: zodResolver(activitySchema),
    defaultValues: selectedActivity
      ? { ...selectedActivity, date: new Date(selectedActivity.date) }
      : {
          title: '',
          description: '',
          category: '',
          city: '',
          venue: '',
        },
  });
  const onSubmit = (data: z.infer<typeof activitySchema>) => {
    const params = { ...data } as Activity;
    if (selectedActivity) params.id = selectedActivity.id;
    handleSubmitForm(params);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{selectedActivity ? 'Edit' : 'Create'} Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
            <InputField form={form} id='title' label='Title' />
            <TextareaField form={form} id='description' label='Description' />
            <InputField form={form} id='category' label='Category' />
            <DatePickerField
              form={form}
              id='date'
              label='Date'
              defaultValue={form.watch('date')}
              dateLimit={
                new Date(new Date().setFullYear(new Date().getFullYear() + 20))
              }
            />
            <InputField form={form} id='city' label='City' />
            <InputField form={form} id='venue' label='Venue' />
            <div className='flex gap-2 justify-end items-center'>
              <Button type='button' onClick={handleCloseForm} variant='ghost'>
                Cancel
              </Button>
              <Button type='submit'>
                {selectedActivity ? 'Save' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
