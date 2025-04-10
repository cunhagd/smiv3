
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Calendar as CalendarIcon, Plus, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const CATEGORIA_OPTIONS = [
  'Selecionar',
  'Educação',
  'Social',
  'Infraestrutura',
  'Saúde',
];

const CICLO_OPTIONS = ['Selecionar', ...Array.from({ length: 100 }, (_, i) => String(i + 1))];

const SemanaFormItem = ({ onRemove, onSave, index }) => {
  const [dataInicial, setDataInicial] = useState(null);
  const [dataFinal, setDataFinal] = useState(null);
  const [ciclo, setCiclo] = useState('Selecionar');
  const [categoria, setCategoria] = useState('Selecionar');
  const [subCategoria, setSubCategoria] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!dataInicial || !dataFinal || ciclo === 'Selecionar' || categoria === 'Selecionar' || !subCategoria) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos antes de cadastrar.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('https://smi-api-production-fae2.up.railway.app/semanas-estrategicas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data_inicial: format(dataInicial, 'yyyy-MM-dd'),
          data_final: format(dataFinal, 'yyyy-MM-dd'),
          ciclo: parseInt(ciclo),
          categoria,
          subcategoria: subCategoria,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao cadastrar semana estratégica');
      }

      toast({
        title: "Sucesso!",
        description: "Semana estratégica cadastrada com sucesso.",
      });

      // Reset form
      setDataInicial(null);
      setDataFinal(null);
      setCiclo('Selecionar');
      setCategoria('Selecionar');
      setSubCategoria('');

      // Notify parent about save
      onSave();
    } catch (error) {
      console.error('Erro ao cadastrar semana estratégica:', error);
      toast({
        title: "Erro ao cadastrar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 bg-dark-card rounded-lg mb-6 relative">
      {index > 0 && (
        <button 
          onClick={onRemove}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/20"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>
      )}
      
      <h3 className="text-lg font-medium mb-4">Cadastrar Semana Estratégica</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">Data Inicial</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-dark-card/80 border-white/10",
                  !dataInicial && "text-gray-400"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dataInicial ? format(dataInicial, "PPP", { locale: ptBR }) : <span>Selecionar</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-dark-card border-white/10">
              <Calendar
                mode="single"
                selected={dataInicial}
                onSelect={setDataInicial}
                initialFocus
                className={cn("p-3 pointer-events-auto bg-dark-card text-white")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">Data Final</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-dark-card/80 border-white/10",
                  !dataFinal && "text-gray-400"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dataFinal ? format(dataFinal, "PPP", { locale: ptBR }) : <span>Selecionar</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-dark-card border-white/10">
              <Calendar
                mode="single"
                selected={dataFinal}
                onSelect={setDataFinal}
                initialFocus
                className={cn("p-3 pointer-events-auto bg-dark-card text-white")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">Ciclo</label>
          <select
            value={ciclo}
            onChange={(e) => setCiclo(e.target.value)}
            className="w-full p-2 bg-dark-card/80 border border-white/10 rounded text-sm text-white focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30"
          >
            {CICLO_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">Categoria</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full p-2 bg-dark-card/80 border border-white/10 rounded text-sm text-white focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30"
          >
            {CATEGORIA_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-200">Sub Categoria</label>
          <Input
            value={subCategoria}
            onChange={(e) => setSubCategoria(e.target.value)}
            className="w-full p-2 bg-dark-card/80 border border-white/10 rounded text-sm text-white focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30"
          />
        </div>
      </div>
      
      <div className="mt-6">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full"
        >
          Cadastrar
        </Button>
      </div>
    </div>
  );
};

const SemanaEstrategica = () => {
  const [forms, setForms] = useState([{ id: 1 }]);
  const [semanasEstrategicas, setSemanasEstrategicas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSemanas = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://smi-api-production-fae2.up.railway.app/semanas-estrategicas');
        if (!response.ok) {
          throw new Error('Falha ao buscar semanas estratégicas');
        }
        const data = await response.json();
        setSemanasEstrategicas(data);
      } catch (error) {
        console.error('Erro ao buscar semanas estratégicas:', error);
        toast({
          title: "Erro ao carregar dados",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSemanas();
  }, [toast]);

  const handleAddForm = () => {
    setForms([...forms, { id: forms.length + 1 }]);
  };

  const handleRemoveForm = (index) => {
    const newForms = [...forms];
    newForms.splice(index, 1);
    setForms(newForms);
  };

  const handleSaveSuccess = () => {
    // Add another form when a form is successfully saved
    handleAddForm();
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar />
      <main className="p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Semana Estratégica</h1>
          <p className="text-gray-400">Cadastro e gerenciamento de semanas estratégicas</p>
        </div>

        {forms.map((form, index) => (
          <SemanaFormItem 
            key={form.id}
            index={index}
            onRemove={() => handleRemoveForm(index)}
            onSave={handleSaveSuccess}
          />
        ))}
      </main>
    </div>
  );
};

export default SemanaEstrategica;
