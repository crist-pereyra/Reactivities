import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useActivityStore } from '@/lib/stores/activity.store';
import { CalendarIcon, Filter } from 'lucide-react';
import { useMemo, useState } from 'react';

export const ActivityFilters = () => {
  const { startDate, setFilter, setStartDate, filter } = useActivityStore();
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
      setStartDate(dateLimit);
      setMonth(dateLimit);
    } else if (parsedDate < minDate) {
      setStartDate(minDate);
      setMonth(minDate);
    } else {
      setStartDate(parsedDate);
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
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All events
          </Button>
          <Button
            variant={filter === 'isGoing' ? 'default' : 'outline'}
            onClick={() => setFilter('isGoing')}
          >
            I'm going
          </Button>
          <Button
            variant={filter === 'isHost' ? 'default' : 'outline'}
            onClick={() => setFilter('isHost')}
          >
            I'm hosting
          </Button>
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
            selected={new Date(startDate)}
            onSelect={(selectedDate) => {
              setStartDate(selectedDate as Date);
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
