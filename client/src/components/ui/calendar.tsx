import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { es } from 'date-fns/locale';
export type CalendarProps = React.ComponentProps<typeof DayPicker>;
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  toYear = new Date().getFullYear(),
  fromYear = 1900,
  month,
  onMonthChange,
  locale,
  ...props
}: CalendarProps) {
  const handleMonthChange = (monthIndex: string) => {
    if (onMonthChange) {
      onMonthChange(new Date(month!.getFullYear(), parseInt(monthIndex)));
    }
  };
  const handlePrevMonth = () => {
    if (onMonthChange) {
      onMonthChange(new Date(month!.getFullYear(), month!.getMonth() - 1));
    }
  };
  const handleNextMonth = () => {
    if (onMonthChange) {
      onMonthChange(new Date(month!.getFullYear(), month!.getMonth() + 1));
    }
  };
  const handleYearChange = (year: string) => {
    if (onMonthChange) {
      onMonthChange(new Date(parseInt(year), month!.getMonth()));
    }
  };
  return (
    <DayPicker
      month={month}
      captionLayout='dropdown-buttons'
      fromYear={fromYear}
      toYear={toYear}
      locale={es}
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-between pt-1 items-center',
        caption_label: 'text-sm font-medium',
        nav: 'flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md'
        ),
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-8 w-8 p-0 font-normal aria-selected:opacity-100'
        ),
        day_range_start: 'day-range-start',
        day_range_end: 'day-range-end',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn('h-4 w-4', className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn('h-4 w-4', className)} {...props} />
        ),
        Caption: ({ displayMonth }) => (
          <div className='flex items-center justify-between w-full'>
            {/* Botón de navegación anterior */}
            <button
              type='button'
              className={cn(buttonVariants({ variant: 'outline' }), 'h-7 w-7')}
              onClick={handlePrevMonth}
            >
              <ChevronLeft className='h-4 w-4' />
            </button>
            {/* Select de mes */}
            <Select
              onValueChange={handleMonthChange}
              defaultValue={String(displayMonth.getMonth())}
            >
              <SelectTrigger className='w-fit border-none shadow-none px-0'>
                <SelectValue placeholder='Mes' />
              </SelectTrigger>
              <SelectContent>
                {[...Array(12).keys()].map((month) => (
                  <SelectItem key={month} value={String(month)}>
                    {new Intl.DateTimeFormat(locale?.code || 'es', {
                      month: 'long',
                    }).format(new Date(0, month))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={handleYearChange}
              defaultValue={String(displayMonth.getFullYear())}
            >
              <SelectTrigger className='w-fit border-none shadow-none px-0'>
                <SelectValue placeholder='Año' />
              </SelectTrigger>
              <SelectContent>
                {Array.from(
                  { length: toYear - fromYear + 1 },
                  (_, i) => fromYear + i
                ).map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Botón de navegación siguiente */}
            <button
              type='button'
              className={cn(buttonVariants({ variant: 'outline' }), 'h-7 w-7')}
              onClick={handleNextMonth}
            >
              <ChevronRight className='h-4 w-4' />
            </button>
          </div>
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';
export { Calendar };
