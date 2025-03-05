/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { format, isValid, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import MaskedInput from 'react-text-mask';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';
import { CalendarArrowDown, CalendarArrowUp, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';

interface Props {
  id: string;
  label: string;
  form: any;
  disabled?: boolean;
  dateLimit?: Date;
  className?: string;
  defaultValue?: Date | null;
}
export function DatePickerField({
  id,
  form,
  label,
  dateLimit = new Date(),
  className = '',
  defaultValue = null,
}: Props) {
  const [date, setDate] = React.useState<Date>();
  const [isYearView, setIsYearView] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date>(defaultValue || new Date());
  const autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd/mm/yyyy');
  const yearsContainerRef = React.useRef<HTMLDivElement>(null);
  const years = React.useMemo(() => {
    const currentYear = dateLimit.getFullYear();
    return Array.from({ length: 100 }, (_, i) => currentYear - 99 + i);
  }, []);
  const scrollToSelectedYear = React.useCallback(() => {
    if (yearsContainerRef.current) {
      if (date) {
        const selectedYearElement = yearsContainerRef.current.querySelector(
          `[data-year="${date.getFullYear()}"]`
        );
        if (selectedYearElement) {
          selectedYearElement.scrollIntoView({
            block: 'center',
            behavior: 'smooth',
          });
        }
      } else {
        yearsContainerRef.current.scrollTop =
          yearsContainerRef.current.scrollHeight;
      }
    }
  }, [date]);
  React.useEffect(() => {
    if (isYearView) {
      setTimeout(scrollToSelectedYear, 0);
    }
  }, [isYearView, scrollToSelectedYear]);
  React.useEffect(() => {
    if (defaultValue) setDate(defaultValue);
  }, []);
  const handleDateChange = (parsedDate: Date) => {
    const minYear = years[0];
    const minDate = new Date(minYear, 0, 1);
    if (parsedDate > dateLimit) {
      setDate(dateLimit);
      setMonth(dateLimit);
      form.setValue(id, dateLimit);
    } else if (parsedDate < minDate) {
      setDate(minDate);
      setMonth(minDate);
      form.setValue(id, minDate);
    } else {
      setDate(parsedDate);
      setMonth(parsedDate);
      form.setValue(id, parsedDate);
    }
  };
  return (
    <FormField
      control={form.control}
      name={id}
      render={({ field }) => (
        <FormItem className={cn('flex flex-col', className)}>
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant='outline'
                  className={cn(
                    'w-full h-9 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs justify-between text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <MaskedInput
                    mask={[
                      /\d/,
                      /\d/,
                      '/',
                      /\d/,
                      /\d/,
                      '/',
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                    ]}
                    pipe={autoCorrectedDatePipe}
                    className='w-28 border-none bg-transparent focus:border-none focus:ring-0'
                    placeholder='__/__/____'
                    id='dateInput'
                    type='text'
                    value={
                      field.value
                        ? format(field.value, 'dd/MM/yyyy')
                        : 'Selecciona una fecha'
                    }
                    onClick={(e: any) => {
                      e.stopPropagation();
                    }}
                    onChange={(e: any) => {
                      const inputDate = e.target.value;
                      const parsedDate = parse(
                        inputDate,
                        'dd/MM/yyyy',
                        new Date(),
                        { locale: es }
                      );
                      if (isValid(parsedDate)) {
                        handleDateChange(parsedDate);
                      }
                    }}
                  />
                  <CalendarIcon className='mr-2 h-4 w-4' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className='w-[250px] p-0' align='start'>
              <div className='bg-primary p-4 text-primary-foreground'>
                <div className='flex items-center justify-between'>
                  <div className='text-lg font-semibold'>
                    {date
                      ? format(date, 'd MMM yyyy', { locale: es })
                      : 'Selecciona una fecha'}
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-primary-foreground hover:bg-white/20'
                    onClick={() => setIsYearView(!isYearView)}
                  >
                    {isYearView ? (
                      <CalendarArrowUp className='h-4 w-4' />
                    ) : (
                      <CalendarArrowDown className='h-4 w-4' />
                    )}
                    {/* <ChevronDown className='h-4 w-4' /> */}
                  </Button>
                </div>
              </div>
              {isYearView ? (
                <div
                  className='max-h-[280px] overflow-y-auto'
                  ref={yearsContainerRef}
                >
                  <div className='grid grid-cols-3 gap-2 p-4'>
                    {years.map((year) => (
                      <Button
                        key={year}
                        variant='ghost'
                        data-year={year}
                        className={cn(
                          'rounded-md',
                          date?.getFullYear() === year &&
                            'bg-primary text-primary-foreground hover:bg-primary/90'
                        )}
                        onClick={() => {
                          const newDate = new Date(month);
                          newDate.setFullYear(year);
                          setMonth(newDate);
                          setDate(newDate);
                          handleDateChange(newDate);
                          setIsYearView(false);
                        }}
                      >
                        {year}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
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
                  locale={es}
                  className='rounded-md border-0'
                  classNames={{
                    day_selected:
                      'bg-primary text-white hover:bg-primary/90 hover:text-white focus:bg-primary focus:text-white',
                    day_today: 'bg-accent text-accent-foreground',
                  }}
                />
              )}
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
