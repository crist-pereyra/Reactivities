/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  FormControl,
  //   FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  form: any;
  id: string;
  label: string;
  className?: string;
}
export const InputField = ({ form, id, label, className, ...props }: Props) => {
  return (
    <FormField
      control={form.control}
      name={id}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} {...props} />
          </FormControl>
          {/* <FormDescription /> */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
