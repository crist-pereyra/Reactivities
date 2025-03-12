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
import { ScrollArea } from '@/components/ui/scroll-area';

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

  // Actualiza el pipe para el date mask (se usa para la parte de la fecha)
  const autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd/mm/yyyy');
  // Mask completa: dd/MM/yyyy hh:mm aa
  const mask = [
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
    ' ',
    /\d/,
    /\d/,
    ':',
    /\d/,
    /\d/,
    ' ',
    /[APap]/,
    /[Mm]/,
  ];

  const yearsContainerRef = React.useRef<HTMLDivElement>(null);
  const years = React.useMemo(() => {
    const currentYear = dateLimit.getFullYear();
    return Array.from({ length: 100 }, (_, i) => currentYear - 99 + i);
  }, [dateLimit]);

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
  }, [defaultValue]);

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

  // Función para actualizar la parte de la hora sin modificar la fecha
  const handleTimeChange = (
    type: 'hour' | 'minute' | 'ampm',
    value: string
  ) => {
    const currentDate = date || new Date();
    const newDate = new Date(currentDate);
    if (type === 'hour') {
      const hour = parseInt(value, 10);
      const isPM = newDate.getHours() >= 12;
      if (hour === 12) {
        newDate.setHours(isPM ? 12 : 0);
      } else {
        newDate.setHours(isPM ? hour + 12 : hour);
      }
    } else if (type === 'minute') {
      newDate.setMinutes(parseInt(value, 10));
    } else if (type === 'ampm') {
      const hours = newDate.getHours();
      if (value === 'AM' && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (value === 'PM' && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }
    setDate(newDate);
    form.setValue(id, newDate);
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
                    mask={mask}
                    pipe={autoCorrectedDatePipe}
                    className='w-56 border-none bg-transparent focus:border-none focus:ring-0'
                    placeholder='__/__/____ __:__ __'
                    id='dateInput'
                    type='text'
                    value={
                      field.value
                        ? format(field.value, 'dd/MM/yyyy hh:mm aa')
                        : 'Selecciona una fecha'
                    }
                    onClick={(e: any) => {
                      e.stopPropagation();
                    }}
                    onChange={(e: any) => {
                      const inputDate = e.target.value;
                      const parsedDate = parse(
                        inputDate,
                        'dd/MM/yyyy hh:mm aa',
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

            <PopoverContent className='w-auto p-0' align='start'>
              <div className='bg-primary p-4 text-primary-foreground'>
                <div className='flex items-center justify-between'>
                  <div className='text-lg font-semibold'>
                    {date
                      ? format(date, 'd MMM yyyy hh:mm aa', { locale: es })
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
                <div className='sm:flex'>
                  {/* Calendario a la izquierda */}
                  <Calendar
                    mode='single'
                    selected={date}
                    onSelect={(selectedDate) => {
                      if (selectedDate) {
                        // Se preserva la hora actual si existe
                        if (date) {
                          selectedDate.setHours(date.getHours());
                          selectedDate.setMinutes(date.getMinutes());
                        }
                        setDate(selectedDate);
                        handleDateChange(selectedDate);
                      }
                    }}
                    disabled={(d) => d > dateLimit}
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

                  {/* Columnas para hora, minutos y AM/PM */}
                  <div
                    className='flex sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x'
                    style={{ minWidth: '130px' }}
                  >
                    <ScrollArea className='w-16 sm:w-auto'>
                      <div className='flex sm:flex-col p-2'>
                        {Array.from({ length: 12 }, (_, i) => i + 1)
                          .reverse()
                          .map((hour) => (
                            <Button
                              key={hour}
                              size='icon'
                              variant={
                                date &&
                                ((hour === 12 && date.getHours() % 12 === 0) ||
                                  (hour !== 12 &&
                                    date.getHours() % 12 === hour))
                                  ? 'default'
                                  : 'ghost'
                              }
                              className='sm:w-full shrink-0 aspect-square'
                              onClick={() =>
                                handleTimeChange('hour', hour.toString())
                              }
                            >
                              {hour}
                            </Button>
                          ))}
                      </div>
                    </ScrollArea>

                    <ScrollArea className='w-16 sm:w-auto'>
                      <div className='flex sm:flex-col p-2'>
                        {Array.from({ length: 12 }, (_, i) => i * 5).map(
                          (minute) => (
                            <Button
                              key={minute}
                              size='icon'
                              variant={
                                date && date.getMinutes() === minute
                                  ? 'default'
                                  : 'ghost'
                              }
                              className='sm:w-full shrink-0 aspect-square'
                              onClick={() =>
                                handleTimeChange('minute', minute.toString())
                              }
                            >
                              {minute.toString().padStart(2, '0')}
                            </Button>
                          )
                        )}
                      </div>
                    </ScrollArea>

                    <ScrollArea className=''>
                      <div className='flex sm:flex-col p-2'>
                        {['AM', 'PM'].map((ampm) => (
                          <Button
                            key={ampm}
                            size='icon'
                            variant={
                              date &&
                              ((ampm === 'AM' && date.getHours() < 12) ||
                                (ampm === 'PM' && date.getHours() >= 12))
                                ? 'default'
                                : 'ghost'
                            }
                            className='sm:w-full shrink-0 aspect-square'
                            onClick={() => handleTimeChange('ampm', ampm)}
                          >
                            {ampm}
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import * as React from 'react';
// import { format, isValid, parse } from 'date-fns';
// import { es } from 'date-fns/locale';
// import MaskedInput from 'react-text-mask';
// import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';
// import { CalendarArrowDown, CalendarArrowUp, CalendarIcon } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/button';
// import { Calendar } from '@/components/ui/calendar';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '../ui/form';

// interface Props {
//   id: string;
//   label: string;
//   form: any;
//   disabled?: boolean;
//   dateLimit?: Date;
//   className?: string;
//   defaultValue?: Date | null;
// }
// export function DatePickerField({
//   id,
//   form,
//   label,
//   dateLimit = new Date(),
//   className = '',
//   defaultValue = null,
// }: Props) {
//   const [date, setDate] = React.useState<Date>();
//   const [isYearView, setIsYearView] = React.useState(false);
//   const [open, setOpen] = React.useState(false);
//   const [month, setMonth] = React.useState<Date>(defaultValue || new Date());
//   const autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd/mm/yyyy');
//   const yearsContainerRef = React.useRef<HTMLDivElement>(null);
//   const years = React.useMemo(() => {
//     const currentYear = dateLimit.getFullYear();
//     return Array.from({ length: 100 }, (_, i) => currentYear - 99 + i);
//   }, []);
//   const scrollToSelectedYear = React.useCallback(() => {
//     if (yearsContainerRef.current) {
//       if (date) {
//         const selectedYearElement = yearsContainerRef.current.querySelector(
//           `[data-year="${date.getFullYear()}"]`
//         );
//         if (selectedYearElement) {
//           selectedYearElement.scrollIntoView({
//             block: 'center',
//             behavior: 'smooth',
//           });
//         }
//       } else {
//         yearsContainerRef.current.scrollTop =
//           yearsContainerRef.current.scrollHeight;
//       }
//     }
//   }, [date]);
//   React.useEffect(() => {
//     if (isYearView) {
//       setTimeout(scrollToSelectedYear, 0);
//     }
//   }, [isYearView, scrollToSelectedYear]);
//   React.useEffect(() => {
//     if (defaultValue) setDate(defaultValue);
//   }, []);
//   const handleDateChange = (parsedDate: Date) => {
//     const minYear = years[0];
//     const minDate = new Date(minYear, 0, 1);
//     if (parsedDate > dateLimit) {
//       setDate(dateLimit);
//       setMonth(dateLimit);
//       form.setValue(id, dateLimit);
//     } else if (parsedDate < minDate) {
//       setDate(minDate);
//       setMonth(minDate);
//       form.setValue(id, minDate);
//     } else {
//       setDate(parsedDate);
//       setMonth(parsedDate);
//       form.setValue(id, parsedDate);
//     }
//   };
//   return (
//     <FormField
//       control={form.control}
//       name={id}
//       render={({ field }) => (
//         <FormItem className={cn('flex flex-col', className)}>
//           <FormLabel>{label}</FormLabel>
//           <Popover open={open} onOpenChange={setOpen}>
//             <PopoverTrigger asChild>
//               <FormControl>
//                 <Button
//                   variant='outline'
//                   className={cn(
//                     'w-full h-9 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs justify-between text-left font-normal',
//                     !date && 'text-muted-foreground'
//                   )}
//                 >
//                   <MaskedInput
//                     mask={[
//                       /\d/,
//                       /\d/,
//                       '/',
//                       /\d/,
//                       /\d/,
//                       '/',
//                       /\d/,
//                       /\d/,
//                       /\d/,
//                       /\d/,
//                     ]}
//                     pipe={autoCorrectedDatePipe}
//                     className='w-28 border-none bg-transparent focus:border-none focus:ring-0'
//                     placeholder='__/__/____'
//                     id='dateInput'
//                     type='text'
//                     value={
//                       field.value
//                         ? format(field.value, 'dd/MM/yyyy')
//                         : 'Selecciona una fecha'
//                     }
//                     onClick={(e: any) => {
//                       e.stopPropagation();
//                     }}
//                     onChange={(e: any) => {
//                       const inputDate = e.target.value;
//                       const parsedDate = parse(
//                         inputDate,
//                         'dd/MM/yyyy',
//                         new Date(),
//                         { locale: es }
//                       );
//                       if (isValid(parsedDate)) {
//                         handleDateChange(parsedDate);
//                       }
//                     }}
//                   />
//                   <CalendarIcon className='mr-2 h-4 w-4' />
//                 </Button>
//               </FormControl>
//             </PopoverTrigger>
//             <PopoverContent className='w-[250px] p-0' align='start'>
//               <div className='bg-primary p-4 text-primary-foreground'>
//                 <div className='flex items-center justify-between'>
//                   <div className='text-lg font-semibold'>
//                     {date
//                       ? format(date, 'd MMM yyyy', { locale: es })
//                       : 'Selecciona una fecha'}
//                   </div>
//                   <Button
//                     variant='ghost'
//                     size='icon'
//                     className='text-primary-foreground hover:bg-white/20'
//                     onClick={() => setIsYearView(!isYearView)}
//                   >
//                     {isYearView ? (
//                       <CalendarArrowUp className='h-4 w-4' />
//                     ) : (
//                       <CalendarArrowDown className='h-4 w-4' />
//                     )}
//                     {/* <ChevronDown className='h-4 w-4' /> */}
//                   </Button>
//                 </div>
//               </div>
//               {isYearView ? (
//                 <div
//                   className='max-h-[280px] overflow-y-auto'
//                   ref={yearsContainerRef}
//                 >
//                   <div className='grid grid-cols-3 gap-2 p-4'>
//                     {years.map((year) => (
//                       <Button
//                         key={year}
//                         variant='ghost'
//                         data-year={year}
//                         className={cn(
//                           'rounded-md',
//                           date?.getFullYear() === year &&
//                             'bg-primary text-primary-foreground hover:bg-primary/90'
//                         )}
//                         onClick={() => {
//                           const newDate = new Date(month);
//                           newDate.setFullYear(year);
//                           setMonth(newDate);
//                           setDate(newDate);
//                           handleDateChange(newDate);
//                           setIsYearView(false);
//                         }}
//                       >
//                         {year}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>
//               ) : (
//                 <Calendar
//                   mode='single'
//                   selected={date}
//                   onSelect={(selectedDate) => {
//                     setDate(selectedDate);
//                     handleDateChange(selectedDate!);
//                   }}
//                   disabled={(date) => date > dateLimit}
//                   month={month}
//                   fromYear={years[0]}
//                   toYear={years[years.length - 1]}
//                   onMonthChange={setMonth}
//                   locale={es}
//                   className='rounded-md border-0'
//                   classNames={{
//                     day_selected:
//                       'bg-primary text-white hover:bg-primary/90 hover:text-white focus:bg-primary focus:text-white',
//                     day_today: 'bg-accent text-accent-foreground',
//                   }}
//                 />
//               )}
//             </PopoverContent>
//           </Popover>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// }
