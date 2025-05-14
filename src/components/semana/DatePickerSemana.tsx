import React, { useState } from 'react';
import { format, subDays, startOfMonth, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

type DatePickerSemanaProps = {
  onChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  strategicDates: Date[];
};

const DatePickerSemana = ({ onChange, strategicDates }: DatePickerSemanaProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [selectedOption, setSelectedOption] = useState<string>('personalizado');

  const predefinedRanges = {
    hoje: {
      label: 'Hoje',
      get range() {
        const today = new Date();
        return { from: today, to: today };
      },
    },
    ultimos7dias: {
      label: 'Últimos 7 dias',
      range: { from: subDays(new Date(), 6), to: new Date() },
    },
    esteMes: {
      label: 'Este mês',
      range: { from: startOfMonth(new Date()), to: new Date() },
    },
    ultimos30dias: {
      label: 'Últimos 30 dias',
      range: { from: subDays(new Date(), 29), to: new Date() },
    },
    personalizado: {
      label: 'Personalizado',
      range: dateRange,
    },
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    if (option !== 'personalizado') {
      const newRange = predefinedRanges[option].range;
      const normalizedRange = {
        from: newRange.from ? new Date(newRange.from.setHours(0, 0, 0, 0)) : undefined,
        to: newRange.to ? new Date(newRange.to.setHours(0, 0, 0, 0)) : undefined,
      };
      setDateRange(normalizedRange);
      onChange(normalizedRange);
      setIsOpen(false);
    }
  };

  const handleDateChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    let adjustedRange = {
      from: range.from ? new Date(range.from.setHours(0, 0, 0, 0)) : undefined,
      to: range.to ? new Date(range.to.setHours(0, 0, 0, 0)) : undefined,
    };
    if (range.from && range.to && range.from > range.to) {
      adjustedRange = { from: range.from, to: range.from };
    }
    if (range.from && !range.to) {
      adjustedRange = { from: range.from, to: range.from };
    }
    if (!range.from && range.to) {
      adjustedRange = { from: range.to, to: range.to };
    }
    if (adjustedRange.from && adjustedRange.to && adjustedRange.from > adjustedRange.to) {
      adjustedRange = { from: adjustedRange.from, to: adjustedRange.from };
    }
    setDateRange(adjustedRange);
    setSelectedOption('personalizado');
    onChange(adjustedRange);
    if (adjustedRange.from && adjustedRange.to) {
      setIsOpen(false);
    }
  };

  const clearFilter = () => {
    const newRange = { from: undefined, to: undefined };
    setDateRange(newRange);
    setSelectedOption('personalizado');
    onChange(newRange);
    setIsOpen(false);
  };

  const formatSelectedRange = () => {
    if (!dateRange.from || !dateRange.to) {
      return 'Selecione um período (Estratégicas)';
    }
    if (selectedOption && selectedOption !== 'personalizado') {
      return predefinedRanges[selectedOption].label;
    }
    return `${format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })} - ${format(dateRange.to, 'dd/MM/yyyy', { locale: ptBR })}`;
  };

  const isStrategicDate = (day: Date) => {
    return strategicDates.some((strategicDate) => isSameDay(day, strategicDate));
  };

  const modifiers = {
    nonStrategic: (day: Date) =>
      !isStrategicDate(day) && !isSameDay(day, dateRange.from || new Date(0)) && !isSameDay(day, dateRange.to || new Date(0)),
  };

  const modifiersClassNames = {
    nonStrategic: 'opacity-30',
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-4 py-2 bg-[#FAF9BF]/20 border border-yellow-500/50 rounded-lg hover:bg-[#FAF9BF]/30 transition-all text-yellow-200"
        >
          <Calendar className="h-4 w-4 text-yellow-400" />
          <span className="text-sm whitespace-nowrap">{formatSelectedRange()}</span>
          <ChevronDown className="h-4 w-4 text-yellow-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[600px] p-4 bg-dark-card border border-yellow-500/50 text-white rounded-xl shadow-lg"
        align="start"
      >
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 w-[150px]">
            {Object.keys(predefinedRanges).map((option) => (
              <Button
                key={option}
                variant={selectedOption === option ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleOptionSelect(option)}
                className={`text-xs py-1 h-8 w-full text-left justify-start ${
                  selectedOption === option
                    ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                    : 'bg-dark-card border-yellow-500/50 text-yellow-200 hover:bg-yellow-500/20'
                } transition-all`}
              >
                {predefinedRanges[option].label}
              </Button>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <CalendarComponent
              mode="range"
              selected={dateRange}
              onSelect={handleDateChange}
              defaultMonth={dateRange.from || new Date()}
              locale={ptBR}
              className="rounded-lg bg-dark-card"
              classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4',
                caption: 'flex justify-center pt-1 relative items-center text-white',
                caption_label: 'text-sm font-medium',
                nav: 'space-x-1 flex items-center',
                nav_button:
                  'h-7 w-7 bg-dark-card hover:bg-yellow-500/20 text-white rounded-md flex items-center justify-center transition-all',
                nav_button_previous: 'absolute left-1',
                nav_button_next: 'absolute right-1',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex',
                head_cell: 'text-gray-400 rounded-md w-9 font-normal text-[0.8rem]',
                row: 'flex w-full mt-2',
                cell: 'text-center text-sm p-0 relative w-9 h-9',
                day: 'h-9 w-9 p-0 font-normal rounded-md transition-all',
                day_selected: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:bg-yellow-600',
                day_today: 'border border-yellow-400/50 text-yellow-400',
                day_outside: 'text-gray-500 opacity-50',
                day_disabled: 'text-gray-600 opacity-50',
                day_range_middle: 'bg-yellow-500/20',
                day_hidden: 'invisible',
              }}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
            />
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilter}
                className="text-xs py-1 h-8 bg-dark-card border border-yellow-500/50 text-yellow-200 hover:bg-yellow-500/20 transition-all"
              >
                Limpar filtro
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerSemana;