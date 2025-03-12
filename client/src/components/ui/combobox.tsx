import { useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  isLoading?: boolean;
  onSelect: (value: string) => void;
}

export const Combobox = ({
  value,
  onChange,
  options,
  isLoading,
  onSelect,
}: ComboboxProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' className='w-full justify-between'>
          {value || 'Select location'}
          <ChevronDown className='h-4 w-4 ml-2' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-2'>
        <Input
          placeholder='Search location...'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className='mb-2'
        />
        {isLoading ? (
          <p className='text-sm text-muted-foreground p-2'>Loading...</p>
        ) : options.length > 0 ? (
          <ul className='border rounded-md max-h-40 overflow-y-auto'>
            {options.map((option) => (
              <li
                key={option.value}
                className='p-2 cursor-pointer hover:bg-gray-100'
                onClick={() => {
                  onSelect(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-sm text-muted-foreground p-2'>No results found</p>
        )}
      </PopoverContent>
    </Popover>
  );
};
