
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const CATEGORIAS = [
  'Selecionar',
  'Educação',
  'Social',
  'Infraestrutura',
  'Saúde',
];

interface FormularioSemanaEstrategicaProps {
  onSubmit: () => void;
}

// Componente do formulário individual
const FormularioSemanaEstrategica: React.FC<FormularioSemanaEstrategicaProps> = ({ onSubmit }) => {
  const [dataInicial, setDataInicial] = useState<Date | undefined>(undefined);
  const [dataFinal, setDataFinal] = useState<Date | undefined>(undefined);
  const [ciclo, setCiclo] = useState<string>("Selecionar");
  const [categoria, setCategoria] = useState<string>("Selecionar");
  const [subCategoria, setSubCategoria] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Gera números de 1 a 100 para o ciclo
  const ciclosOpcoes = ['Selecionar', ...Array.from({ length: 100 }, (_, i) => (i + 1).toString())];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!dataInicial) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, selecione a data inicial.",
        variant: "destructive",
      });
      return;
    }
    
    if (!dataFinal) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, selecione a data final.",
        variant: "destructive",
      });
      return;
    }
    
    if (ciclo === "Selecionar") {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, selecione o ciclo.",
        variant: "destructive",
      });
      return;
    }
    
    if (categoria === "Selecionar") {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, selecione a categoria.",
        variant: "destructive",
      });
      return;
    }
    
    if (!subCategoria.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe a subcategoria.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Aqui você faria a chamada à API para salvar a semana estratégica
      // Como solicitado, estamos apenas criando a interface sem implementar a chamada API real
      console.log("Semana Estratégica cadastrada:", {
        dataInicial: dataInicial.toISOString().split('T')[0],
        dataFinal: dataFinal.toISOString().split('T')[0],
        ciclo,
        categoria,
        subCategoria
      });
      
      // Reseta o formulário
      setDataInicial(undefined);
      setDataFinal(undefined);
      setCiclo("Selecionar");
      setCategoria("Selecionar");
      setSubCategoria("");
      
      toast({
        title: "Sucesso!",
        description: "Semana Estratégica cadastrada com sucesso.",
      });
      
      // Notifica o componente pai para adicionar um novo formulário
      onSubmit();
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      toast({
        title: "Erro ao cadastrar",
        description: "Não foi possível cadastrar a Semana Estratégica. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-card mb-6">
      <h2 className="text-lg font-semibold mb-4">Cadastrar Semana Estratégica</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Data Inicial */}
          <div>
            <label className="block text-sm font-medium mb-1">Data Inicial</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dataInicial && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataInicial ? format(dataInicial, "dd/MM/yyyy") : "Selecionar"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dataInicial}
                  onSelect={setDataInicial}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Data Final */}
          <div>
            <label className="block text-sm font-medium mb-1">Data Final</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dataFinal && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataFinal ? format(dataFinal, "dd/MM/yyyy") : "Selecionar"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dataFinal}
                  onSelect={setDataFinal}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Ciclo */}
          <div>
            <label className="block text-sm font-medium mb-1">Ciclo</label>
            <div className="relative">
              <select
                value={ciclo}
                onChange={(e) => setCiclo(e.target.value)}
                className="w-full p-2 pl-3 pr-10 bg-dark-card border border-white/10 rounded text-sm text-white appearance-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30 hover:border-white/20"
              >
                {ciclosOpcoes.map((opcao) => (
                  <option key={opcao} value={opcao}>
                    {opcao}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/60">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium mb-1">Categoria</label>
            <div className="relative">
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full p-2 pl-3 pr-10 bg-dark-card border border-white/10 rounded text-sm text-white appearance-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30 hover:border-white/20"
              >
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/60">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Sub Categoria */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Sub Categoria</label>
            <input
              type="text"
              value={subCategoria}
              onChange={(e) => setSubCategoria(e.target.value)}
              className="w-full p-2 bg-dark-card border border-white/10 rounded text-sm text-white focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30 hover:border-white/20"
              placeholder="Digite a subcategoria"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-brand-yellow text-black hover:bg-brand-yellow/90"
          >
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </div>
      </form>
    </div>
  );
};

// Página principal
const SemanaEstrategica = () => {
  const [formularios, setFormularios] = useState<number[]>([0]);

  const adicionarFormulario = () => {
    setFormularios([...formularios, formularios.length]);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar />
      <main className="p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Semana Estratégica</h1>
          <p className="text-gray-400">Cadastro e gerenciamento de semanas estratégicas</p>
        </div>

        {formularios.map((id) => (
          <FormularioSemanaEstrategica 
            key={id} 
            onSubmit={adicionarFormulario}
          />
        ))}
      </main>
    </div>
  );
};

export default SemanaEstrategica;
