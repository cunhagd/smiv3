
import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  isNegative?: boolean;
  icon?: React.ReactNode;
  className?: string;
  description?: string; // New prop for additional information
}

const StatCard = ({ 
  title, 
  value, 
  change, 
  isPositive = false,
  isNegative = false,
  icon, 
  className,
  description = "Aqui você encontra detalhes adicionais sobre esta métrica e como ela é calculada. Clique para ver mais informações sobre tendências históricas.", // Default description
}: StatCardProps) => {
  return (
    <div className={cn("dashboard-card", className)}>
      <div className="dashboard-card-header">
        <span className="text-sm text-gray-400">{title}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="p-1 hover:bg-white/5 rounded-full">
                    <ArrowUpRight className="h-4 w-4 text-gray-400" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-dark-card border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle>{title} - Detalhes</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-3xl font-bold">{value}</h3>
                      {change && (
                        <span 
                          className={cn(
                            "text-sm flex items-center gap-1",
                            isPositive && "text-brand-yellow",
                            isNegative && "text-brand-red",
                            !isPositive && !isNegative && "text-gray-400"
                          )}
                        >
                          {change}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300">{description}</p>
                    <div className="pt-4 border-t border-white/10">
                      <h4 className="font-medium mb-2">Evolução histórica</h4>
                      <div className="h-32 bg-white/5 rounded-md flex items-center justify-center">
                        <p className="text-gray-400 text-sm">Gráfico de tendência seria exibido aqui</p>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <TooltipContent side="right" className="bg-dark-card text-white border-white/10">
                <p>Clique para mais detalhes</p>
              </TooltipContent>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-3xl font-bold">{value}</h3>
          {change && (
            <span 
              className={cn(
                "text-sm flex items-center gap-1",
                isPositive && "text-brand-yellow",
                isNegative && "text-brand-red",
                !isPositive && !isNegative && "text-gray-400"
              )}
            >
              {change}
            </span>
          )}
        </div>
        {icon && (
          <div className="text-brand-yellow">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
