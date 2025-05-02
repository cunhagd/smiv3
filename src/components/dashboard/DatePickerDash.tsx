import React, { useState } from 'react';
import { format, subDays, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

type DatePickerDashProps = {
  onChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
};

const DatePickerDash = ({ onChange }: DatePickerDashProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });
  const [selectedOption, setSelectedOption] = useState<string>('ultimos30dias');

  const predefinedRanges = {
    hoje: {
      label: 'Hoje',
      get range() { // Usando um getter para sempre retornar a data atual
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
      
      // Normaliza as datas (remove horas, minutos, segundos e milissegundos)
      const normalizedRange = {
        from: newRange.from ? new Date(newRange.from.setHours(0, 0, 0, 0)) : undefined,
        to: newRange.to ? new Date(newRange.to.setHours(0, 0, 0, 0)) : undefined
      };
      
      setDateRange(normalizedRange);
      onChange(normalizedRange);
      setIsOpen(false);
    }
  };

  const handleDateChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    let adjustedRange = { 
      from: range.from ? new Date(range.from.setHours(0, 0, 0, 0)) : undefined, 
      to: range.to ? new Date(range.to.setHours(0, 0, 0, 0)) : undefined 
    };
    if (range.from && range.to && range.from > range.to) {
      adjustedRange = { from: range.from, to: range.from }; // Garante que 'to' não seja menor que 'from'
    }
    if (range.from && !range.to) {
      adjustedRange = { from: range.from, to: range.from }; // Mesmo dia se 'to' não for selecionado
    }
    if (!range.from && range.to) {
      adjustedRange = { from: range.to, to: range.to }; // Mesmo dia se 'from' não for selecionado
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
  };

  const formatSelectedRange = () => {
    if (!dateRange.from || !dateRange.to) {
      return 'Selecione um período';
    }
    if (selectedOption && selectedOption !== 'personalizado') {
      return predefinedRanges[selectedOption].label;
    }
    return `${format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })} - ${format(dateRange.to, 'dd/MM/yyyy', { locale: ptBR })}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-4 py-2 bg-dark-card border border-white/10 rounded-lg hover:bg-gray-200/10 hover:border-white/30 transition-all text-white group"
        >
          <Calendar className="h-4 w-4 text-gray-400 group-hover:text-white transition-all" />
          <span className="text-sm whitespace-nowrap group-hover:text-white transition-all">
            {formatSelectedRange()}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-white transition-all" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[600px] p-4 bg-dark-card border border-white/10 text-white rounded-xl shadow-lg"
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
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-dark-card border-white/10 text-white hover:bg-blue-500/20'
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
                  'h-7 w-7 bg-dark-card hover:bg-white-500/20 text-white rounded-md flex items-center justify-center transition-all',
                nav_button_previous: 'absolute left-1',
                nav_button_next: 'absolute right-1',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex',
                head_cell: 'text-gray-400 rounded-md w-9 font-normal text-[0.8rem]',
                row: 'flex w-full mt-2',
                cell: 'text-center text-sm p-0 relative w-9 h-9',
                day: 'h-9 w-9 p-0 font-normal rounded-md transition-all',
                day_selected: 'bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600',
                day_today: 'border border-blue-400/50 text-blue-400',
                day_outside: 'text-gray-500 opacity-50',
                day_disabled: 'text-gray-600 opacity-50',
                day_range_middle: 'bg-blue-500/20',
                day_hidden: 'invisible',
              }}
            />
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilter}
                className="text-xs py-1 h-8 bg-dark-card border border-white/10 text-white hover:bg-blue-500/20 transition-all"
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

export default DatePickerDash;