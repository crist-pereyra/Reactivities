import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Filter } from 'lucide-react';
import { useMemo, useState } from 'react';

export const ActivityFilters = () => {
  const [date, setDate] = useState<Date>();
  const [month, setMonth] = useState<Date>(new Date());
  const dateLimit = new Date(
    new Date().setFullYear(new Date().getFullYear() + 50)
  );
  const years = useMemo(() => {
    const currentYear = dateLimit.getFullYear();
    return Array.from({ length: 100 }, (_, i) => currentYear - 99 + i);
  }, []);
  const handleDateChange = (parsedDate: Date) => {
    const minYear = years[0];
    const minDate = new Date(minYear, 0, 1);
    if (parsedDate > dateLimit) {
      setDate(dateLimit);
      setMonth(dateLimit);
    } else if (parsedDate < minDate) {
      setDate(minDate);
      setMonth(minDate);
    } else {
      setDate(parsedDate);
      setMonth(parsedDate);
    }
  };
  return (
    <div className='flex flex-col gap-y-5'>
      <Card>
        <CardHeader>
          <CardTitle className='flex gap-2 items-center'>
            {' '}
            <Filter className='h-4 w-4' />
            <h4 className='font-semibold'>Filters</h4>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-y-2'>
          <Button variant={'outline'}>All events</Button>
          <Button variant={'outline'}>I'm going</Button>
          <Button variant={'outline'}>I'm hosting</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className='flex gap-2 items-center'>
            <CalendarIcon className='h-4 w-4' />
            <h4 className='font-semibold'>Select date</h4>
          </CardTitle>
        </CardHeader>
        <CardContent className='w-fit mx-auto'>
          <Calendar
            mode='single'
            selected={date}
            onSelect={(selectedDate) => {
              setDate(selectedDate);
              handleDateChange(selectedDate!);
            }}
            disabled={(date) => date > dateLimit}
            month={month}
            fromYear={years[0]}
            toYear={years[years.length - 1]}
            onMonthChange={setMonth}
            className='rounded-md border-0'
            classNames={{
              day_selected:
                'bg-primary text-white hover:bg-primary/90 hover:text-white focus:bg-primary focus:text-white',
              day_today: 'bg-accent text-accent-foreground',
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};
