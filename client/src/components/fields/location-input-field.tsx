/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import axios from 'axios';
import { LocationIQSuggestion } from '@/lib/interfaces/location-iq-suggestion';

interface Props {
  form: any;
  id: string;
  label: string;
  className?: string;
}

export const LocationInputField = ({ form, id, label, className }: Props) => {
  const [query, setQuery] = useState(form.getValues(id)?.venue || '');
  const [suggestions, setSuggestions] = useState<LocationIQSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get<LocationIQSuggestion[]>(
          `https://api.locationiq.com/v1/autocomplete?key=pk.f7a568a71fe5ad36e980e4fef967f768&q=${debouncedQuery}&limit=5&dedupe=1`
        );
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSelect = (suggestion: LocationIQSuggestion) => {
    form.setValue(id, {
      city:
        suggestion.address?.city ||
        suggestion.address?.town ||
        suggestion.address?.village ||
        suggestion.display_place ||
        '',
      venue: suggestion.display_name,
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon),
    });
    setQuery(suggestion.display_name);
    setOpen(false);
  };

  return (
    <FormField
      control={form.control}
      name={id}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant='outline' className='w-full justify-between'>
                {query || 'Enter location'}
                <ChevronDown className='h-4 w-4 ml-2' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-2'>
              <Input
                placeholder='Search location...'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className='mb-2 w-full'
              />
              {loading ? (
                <p className='text-sm text-muted-foreground p-2'>Loading...</p>
              ) : suggestions.length > 0 ? (
                <ul className='border rounded-md max-h-40 overflow-y-auto'>
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.place_id}
                      className='p-2 cursor-pointer hover:bg-gray-100'
                      onClick={() => handleSelect(suggestion)}
                    >
                      {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='text-sm text-muted-foreground p-2'>
                  No results found
                </p>
              )}
            </PopoverContent>
          </Popover>
          <FormControl>
            <Input {...field} value={query} className='hidden' />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
