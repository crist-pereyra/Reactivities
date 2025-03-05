/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  FormControl,
  //   FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Textarea } from '../ui/textarea';

interface Props {
  form: any;
  id: string;
  label: string;
  className?: string;
  maxLength?: number;
  isVisibleCounter?: boolean;
  [key: string]: any;
}
export const TextareaField = ({
  form,
  id,
  label,
  className,
  maxLength = 200,
  isVisibleCounter = false,
  ...props
}: Props) => {
  return (
    <FormField
      control={form.control}
      name={id}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea {...field} maxLength={maxLength} {...props} />
          </FormControl>
          {/* <FormDescription /> */}
          <div className='flex justify-between items-center'>
            <FormMessage />
            {isVisibleCounter && (
              <span className='text-right ml-auto text-sm text-muted-foreground'>
                {field.value.length}/{maxLength}
              </span>
            )}
          </div>
        </FormItem>
      )}
    />
  );
};
