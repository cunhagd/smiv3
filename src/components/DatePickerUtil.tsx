import React, { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

type DatePickerUtilProps = {
  onChange: (date: Date | undefined) => void;
  utilDates: Date[];
};

const DatePickerUtil = ({ onChange, utilDates }: DatePickerUtilProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

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
      return 'Selecione uma data (Útil)';
    }
    return format(selectedDate, 'dd/MM/yyyy', { locale: ptBR });
  };

  // Função para determinar se a data tem notícias marcadas como "Útil"
  const isUtilDate = (day: Date) => {
    return utilDates.some((utilDate) => isSameDay(day, utilDate));
  };

  // Definir modificadores para os dias que não têm notícias "Útil" e não estão selecionados
  const modifiers = {
    nonUtil: (day: Date) =>
      !isUtilDate(day) && !isSameDay(day, selectedDate || new Date(0)),
  };

  // Mapear modificadores para classes CSS
  const modifiersClassNames = {
    nonUtil: 'opacity-30',
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-4 py-2 bg-[#ff69ff]/20 border border-[#ff69ff]/50 rounded-lg hover:bg-[#ff69ff]/30 transition-all text-[#ff69ff]"
        >
          <Calendar className="h-4 w-4 text-[#ff69ff]" />
          <span className="text-sm whitespace-nowrap">{formatSelectedDate()}</span>
          <ChevronDown className="h-4 w-4 text-[#ff69ff]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 bg-dark-card border border-[#ff69ff]/50 text-white rounded-xl shadow-lg" align="start">
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
              caption: "flex justify-center pt-1 relative items-center text-white",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button:
                "h-7 w-7 bg-dark-card hover:bg-[#ff99ff]/20 text-white rounded-md flex items-center justify-center transition-all",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative w-9 h-9",
              day: "h-9 w-9 p-0 font-normal rounded-md transition-all",
              day_selected:
                "bg-[#ff69ff] text-white hover:bg-[#ff99ff] focus:bg-[#ff99ff]",
              day_today: "border border-[#ff69ff]/50 text-[#ff69ff]",
              day_outside: "text-gray-500 opacity-50",
              day_disabled: "text-gray-600 opacity-50",
              day_range_middle: "bg-[#ff69ff]/20",
              day_hidden: "invisible",
            }}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
          />
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilter}
              className="text-xs py-1 h-8 bg-dark-card border border-[#ff69ff]/50 text-[#ff69ff] hover:bg-[#ff69ff]/20 transition-all"
            >
              Limpar filtro
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerUtil;