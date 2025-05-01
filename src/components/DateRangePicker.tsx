import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

type DatePickerProps = {
  onChange: (date: Date | undefined) => void;
};

const DatePicker = ({ onChange }: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    onChange(date);
    if (date) {
      setIsOpen(false); // Fecha o popover após selecionar uma data
    }
  };

  const clearFilter = () => {
    setSelectedDate(undefined);
    onChange(undefined);
    setIsOpen(false);
  };

  const formatSelectedDate = () => {
    if (!selectedDate) {
      return 'Selecione uma data';
    }
    return format(selectedDate, 'dd/MM/yyyy', { locale: ptBR });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-4 py-2 bg-dark-card border border-white/10 rounded-lg hover:bg-gray-200/10 hover:border-white/30 transition-all text-white group"
        >
          <Calendar className="h-4 w-4 text-gray-400 group-hover:text-white transition-all" />
          <span className="text-sm whitespace-nowrap group-hover:text-white transition-all">{formatSelectedDate()}</span>
          <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-white transition-all" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 bg-dark-card border border-white/10 text-white rounded-xl shadow-lg" align="start">
        <div className="flex flex-col gap-4">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
            defaultMonth={selectedDate || new Date()}
            locale={ptBR}
            className="rounded-lg bg-dark-card"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center textAuto-white",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button:
                "h-7 w-7 bg-dark-card hover:bg-white-500/20 text-white rounded-md flex items-center justify-center transition-all",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative w-9 h-9",
              day: "h-9 w-9 p-0 font-normal rounded-md transition-all",
              day_selected:
                "bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600",
              day_today: "border border-blue-400/50 text-blue-400",
              day_outside: "text-gray-500 opacity-50",
              day_disabled: "text-gray-600 opacity-50",
              day_range_middle: "bg-blue-500/20",
              day_hidden: "invisible",
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
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;