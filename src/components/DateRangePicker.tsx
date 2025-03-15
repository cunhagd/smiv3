
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

type DateRangePickerProps = {
  onChange: (range: DateRange) => void;
};

const DateRangePicker = ({ onChange }: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('last30');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  const presets = [
    { id: 'last7', label: 'Últimos 7 dias', days: 7 },
    { id: 'last30', label: 'Últimos 30 dias', days: 30 },
    { id: 'currentMonth', label: 'Mês atual', days: 0 },
    { id: 'custom', label: 'Personalizado', days: 0 },
  ];

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId);

    if (presetId === 'custom') {
      return;
    }

    let from: Date;
    let to = new Date();

    if (presetId === 'currentMonth') {
      from = new Date(to.getFullYear(), to.getMonth(), 1);
    } else {
      const preset = presets.find((p) => p.id === presetId);
      from = new Date(to);
      from.setDate(to.getDate() - (preset?.days || 0));
    }

    const newRange = { from, to };
    setDateRange(newRange);
    onChange(newRange);
    setIsOpen(false);
  };

  const handleDateRangeChange = (range: DateRange) => {
    if (!range.from || !range.to) return;
    
    setDateRange(range);
    onChange(range);
    
    // If both dates are selected, close the popover
    if (range.from && range.to) {
      setSelectedPreset('custom');
    }
  };

  const formatDateRange = () => {
    if (!dateRange.from || !dateRange.to) {
      return 'Selecione um período';
    }

    return `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 px-3 py-2 bg-dark-card border border-white/10 rounded-lg hover:bg-dark-card-hover"
        >
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm whitespace-nowrap">{formatDateRange()}</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-dark-card border border-white/10 text-white" align="start">
        <div className="flex">
          <div className="border-r border-white/10 p-3 space-y-2 w-48">
            <h3 className="font-medium mb-2">Períodos</h3>
            {presets.map((preset) => (
              <Button
                key={preset.id}
                variant={selectedPreset === preset.id ? "default" : "ghost"}
                className="w-full justify-start text-sm"
                onClick={() => handlePresetChange(preset.id)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <div className="p-3">
            <CalendarComponent
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
              locale={ptBR}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
