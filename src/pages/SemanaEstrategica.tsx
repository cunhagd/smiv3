import { Pencil, Save, X, CalendarIcon, ChevronDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, parse } from "date-fns";
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
  onSubmit: (novaSemana: any) => void;
}

const FormularioSemanaEstrategica: React.FC<FormularioSemanaEstrategicaProps> = ({ onSubmit }) => {
  const [dataInicial, setDataInicial] = useState<Date | undefined>(undefined);
  const [dataFinal, setDataFinal] = useState<Date | undefined>(undefined);
  const [ciclo, setCiclo] = useState<string>("Selecionar");
  const [categoria, setCategoria] = useState<string>("Selecionar");
  const [subCategoria, setSubCategoria] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const ciclosOpcoes = ['Selecionar', ...Array.from({ length: 100 }, (_, i) => (i + 1).toString())];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const novaSemana = {
        data_inicial: format(dataInicial, "dd/MM/yyyy"),
        data_final: format(dataFinal, "dd/MM/yyyy"),
        ciclo: parseInt(ciclo, 10),
        categoria,
        subcategoria: subCategoria,
      };

      const response = await fetch('http://localhost:3000/semana-estrategica', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaSemana),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao cadastrar semana estratégica');
      }

      const semanaCadastrada = await response.json();

      setDataInicial(undefined);
      setDataFinal(undefined);
      setCiclo("Selecionar");
      setCategoria("Selecionar");
      setSubCategoria("");

      toast({
        title: "Sucesso!",
        description: "Semana Estratégica cadastrada com sucesso.",
      });

      onSubmit(semanaCadastrada);
    } catch (error) {
      console.error("Erro ao cadastrar:", error.message);
      toast({
        title: "Erro ao cadastrar",
        description: error.message || "Não foi possível cadastrar a Semana Estratégica. Tente novamente.",
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

const SemanaEstrategica = () => {
  const [semanas, setSemanas] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSemanas = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3000/semana-estrategica');
        
        if (!response.ok) {
          if (response.status === 0) {
            throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
          }
          const errorData = await response.json();
          throw new Error(errorData.error || 'Falha ao buscar semanas estratégicas');
        }
        
        const { data } = await response.json();
        setSemanas(data);
        
      } catch (error) {
        console.error('Erro ao buscar semanas:', error.message);
        setError(error.message);
        toast({
          title: "Erro ao carregar semanas",
          description: error.message || "Não foi possível carregar as semanas estratégicas. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchSemanas();
  }, [toast]);

  const handleEdit = (semana: any) => {
    setEditingId(semana.id);
    setEditedData({
      ...semana,
      data_inicial: parse(semana.data_inicial, 'dd/MM/yyyy', new Date()),
      data_final: parse(semana.data_final, 'dd/MM/yyyy', new Date())
    });
  };

  const handleSave = async (id: number) => {
    try {
      const formattedData = {
        ...editedData,
        data_inicial: format(editedData.data_inicial, 'dd/MM/yyyy'),
        data_final: format(editedData.data_final, 'dd/MM/yyyy')
      };

      const response = await fetch(`http://localhost:3000/semana-estrategica/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao atualizar semana estratégica');
      }
      
      const updatedSemana = await response.json();
      setSemanas(semanas.map(s => s.id === id ? updatedSemana : s));
      setEditingId(null);
      
      // Dispara um evento para notificar outros componentes
      localStorage.setItem('semanaEstrategicaUpdated', Date.now().toString());
      
      toast({
        title: "Sucesso!",
        description: "Semana atualizada com sucesso",
      });
      
    } catch (error) {
      console.error("Erro ao atualizar:", error.message);
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar a Semana Estratégica. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData({});
  };

  const handleFieldChange = (field: string, value: any) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const adicionarSemana = (novaSemana: any) => {
    setSemanas(prev => [...prev, novaSemana]);
    // Dispara um evento para notificar outros componentes
    localStorage.setItem('semanaEstrategicaUpdated', Date.now().toString());
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar />
      <main className="p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Semana Estratégica</h1>
          <p className="text-gray-400">Cadastro e gerenciamento de semanas estratégicas</p>
        </div>

        <FormularioSemanaEstrategica onSubmit={adicionarSemana} />

        <div className="dashboard-card">
          <h2 className="text-lg font-semibold mb-4">Semanas Estratégicas Cadastradas</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-gray-400">Carregando dados...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-red-400">Erro ao carregar dados: {error}</p>
            </div>
          ) : semanas.length === 0 ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-gray-400">Nenhuma semana estratégica encontrada</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 border-b border-white/10">
                  <th className="py-2 px-4">ID</th>
                  <th className="py-2 px-4">Data Inicial</th>
                  <th className="py-2 px-4">Data Final</th>
                  <th className="py-2 px-4">Ciclo</th>
                  <th className="py-2 px-4">Categoria</th>
                  <th className="py-2 px-4">Subcategoria</th>
                  <th className="py-2 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {semanas.map((semana) => (
                  <tr key={semana.id} className="border-b border-white/10">
                    <td className="py-2 px-4">{semana.id}</td>

                    {/* Data Inicial */}
                    <td className="py-2 px-4">
                      {editingId === semana.id ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="h-8 p-2 text-xs border-white/20"
                            >
                              {format(editedData.data_inicial, 'dd/MM/yyyy')}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={editedData.data_inicial}
                              onSelect={(date) => handleFieldChange('data_inicial', date)}
                            />
                          </PopoverContent>
                        </Popover>
                      ) : (
                        semana.data_inicial
                      )}
                    </td>

                    {/* Data Final */}
                    <td className="py-2 px-4">
                      {editingId === semana.id ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="h-8 p-2 text-xs border-white/20"
                            >
                              {format(editedData.data_final, 'dd/MM/yyyy')}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={editedData.data_final}
                              onSelect={(date) => handleFieldChange('data_final', date)}
                            />
                          </PopoverContent>
                        </Popover>
                      ) : (
                        semana.data_final
                      )}
                    </td>

                    {/* Ciclo */}
                    <td className="py-2 px-4">
                      {editingId === semana.id ? (
                        <select
                          value={editedData.ciclo}
                          onChange={(e) => handleFieldChange('ciclo', parseInt(e.target.value))}
                          className="bg-dark-card border border-white/20 rounded px-2 py-1"
                        >
                          {Array.from({ length: 100 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                      ) : (
                        semana.ciclo
                      )}
                    </td>

                    {/* Categoria */}
                    <td className="py-2 px-4">
                      {editingId === semana.id ? (
                        <select
                          value={editedData.categoria}
                          onChange={(e) => handleFieldChange('categoria', e.target.value)}
                          className="bg-dark-card border border-white/20 rounded px-2 py-1"
                        >
                          {CATEGORIAS.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      ) : (
                        semana.categoria || '-'
                      )}
                    </td>

                    {/* Subcategoria */}
                    <td className="py-2 px-4">
                      {editingId === semana.id ? (
                        <input
                          type="text"
                          value={editedData.subcategoria}
                          onChange={(e) => handleFieldChange('subcategoria', e.target.value)}
                          className="bg-dark-card border border-white/20 rounded px-2 py-1 w-full"
                        />
                      ) : (
                        semana.subcategoria || '-'
                      )}
                    </td>

                    {/* Ações */}
                    <td className="py-2 px-4">
                      {editingId === semana.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSave(semana.id)}
                            className="text-green-400 hover:text-green-300"
                          >
                            <Save size={18} />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(semana)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Pencil size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default SemanaEstrategica;