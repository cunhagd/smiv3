import React, { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

type DatePickerSuporteProps = {
  onChange: (date: Date | undefined) => void;
  suporteDates: Date[];
};

const DatePickerSuporte = ({ onChange, suporteDates }: DatePickerSuporteProps) => {
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
      return 'Selecione uma data (Suporte)';
    }
    return format(selectedDate, 'dd/MM/yyyy', { locale: ptBR });
  };

  // Função para determinar se a data tem notícias marcadas como "Suporte"
  const isSuporteDate = (day: Date) => {
    return suporteDates.some((suporteDate) => isSameDay(day, suporteDate));
  };

  // Definir modificadores para os dias que não têm notícias "Suporte" e não estão selecionados
  const modifiers = {
    nonSuporte: (day: Date) =>
      !isSuporteDate(day) && !isSameDay(day, selectedDate || new Date(0)),
  };

  // Mapear modificadores para classes CSS
  const modifiersClassNames = {
    nonSuporte: 'opacity-30',
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-4 py-2 bg-[#FFDEE2]/20 border border-blue-500/50 rounded-lg hover:bg-[#FFDEE2]/30 transition-all text-blue-200"
        >
          <Calendar className="h-4 w-4 text-blue-700" />
          <span className="text-sm whitespace-nowrap">{formatSelectedDate()}</span>
          <ChevronDown className="h-4 w-4 text-blue-700" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 bg-dark-card border border-blue-500/50 text-white rounded-xl shadow-lg" align="start">
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
                "h-7 w-7 bg-dark-card hover:bg-blue-500/20 text-white rounded-md flex items-center justify-center transition-all",
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
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
          />
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilter}
              className="text-xs py-1 h-8 bg-dark-card border border-blue-500/50 text-blue-200 hover:bg-blue-500/20 transition-all"
            >
              Limpar filtro
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerSuporte;