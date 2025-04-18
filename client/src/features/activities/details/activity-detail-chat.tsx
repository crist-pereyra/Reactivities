import { Spinner } from '@/components/shared/spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useComments } from '@/lib/hooks/useComments';
import {
  addCommentSchema,
  AddCommentSchema,
} from '@/lib/validations/add-comment.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatDistanceToNow } from 'date-fns';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';

export const ActivityDetailChat = () => {
  const { id } = useParams();
  const { comments, hubConnection } = useComments(id);
  const form = useForm<AddCommentSchema>({
    resolver: zodResolver(addCommentSchema),
    mode: 'onTouched',
    defaultValues: {
      comment: '',
    },
  });
  const handleAddComment = async (comment: string) => {
    try {
      await hubConnection?.invoke('SendComment', {
        activityId: id,
        body: comment,
      });
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };
  const onSubmit = async (data: AddCommentSchema) => {
    handleAddComment(data.comment);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const commentValue = form.getValues('comment').trim();
      if (commentValue.length > 0) {
        form.handleSubmit(onSubmit)();
      }
    }
  };
  return (
    <>
      <div className='text-center bg-primary text-primary-foreground p-4 rounded-t-lg'>
        <h6 className='text-lg font-medium'>Chat about this event</h6>
      </div>
      <Card className='rounded-t-none'>
        <CardContent className='p-4'>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name={'comment'}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className='relative w-full'>
                          <Textarea
                            {...field}
                            onKeyDown={handleKeyPress}
                            className='w-full pr-10 resize-none'
                            rows={2}
                            placeholder='Enter your comment (Enter to submit, SHIFT + Enter for new line)'
                          />
                          <div className='absolute bottom-2 right-2 text-muted-foreground'>
                            <Spinner show={form.formState.isSubmitting} />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>

          <div className='max-h-[400px] overflow-y-scroll'>
            {comments.map((comment) => (
              <div className='flex my-4' key={comment.id}>
                <Avatar className='mr-3'>
                  <AvatarImage src={comment.imageUrl} alt='User' />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <div className='flex items-center gap-3'>
                    <Link
                      to={`/profile/${comment.userId}`}
                      className='font-bold text-sm no-underline hover:underline'
                    >
                      {comment.displayName}
                    </Link>
                    <span className='text-xs text-muted-foreground'>
                      {formatDistanceToNow(comment.createdAt)} ago
                    </span>
                  </div>

                  <p className='whitespace-pre-wrap'>{comment.body}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
