import { Pencil, Save, X, CalendarIcon, ChevronDown, Trash2, Turtle } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, parse, isValid, eachDayOfInterval, startOfMonth, isSameDay } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import AddSemana from '@/components/semana/AddSemana';
import PontuacaoSemana from '@/components/semana/Pontuacao';
import TotalNoticiasSemana from '@/components/semana/TotalNoticias';
import SemanasCadastradas from '@/components/semana/SemanasCadastradas'; // Novo import
import GraficoCategoria from '@/components/semana/GraficoCategoria';
import DatePickerSemana from '@/components/semana/DatePickerSemana';

const CATEGORIAS = [
  'Todas',
  'Educação',
  'Social',
  'Infraestrutura',
  'Saúde',
];

export interface Semana {
  id: number;
  data_inicial: Date | string;
  data_final: Date | string;
  ciclo: number;
  categoria: string;
  subcategoria: string;
}

export interface FormularioSemanaEstrategicaProps {
  onSubmit: (novaSemana: Semana) => void;
}

export interface Noticia {
  id: number;
  data: string;
  categoria: string;
  subcategoria: string;
  ciclo: number;
  estrategica: boolean;
}

export interface TotalNoticiasSemanaProps {
  dateRange: { from: Date | undefined; to: Date | undefined };
}

export interface PontuacaoSemanaProps {
  dateRange: { from: Date | undefined; to: Date | undefined };
}

export interface GraficoCategoriaProps {
  dateRange: { from: Date | undefined; to: Date | undefined };
}

export const FormularioSemanaEstrategica: React.FC<FormularioSemanaEstrategicaProps> = ({ onSubmit }) => {
  const [dataInicial, setDataInicial] = useState<Date | undefined>(undefined);
  const [dataFinal, setDataFinal] = useState<Date | undefined>(undefined);
  const [ciclo, setCiclo] = useState<string>("");
  const [categoria, setCategoria] = useState<string>("Selecionar");
  const [subCategoria, setSubCategoria] = useState<string>("");
  const [isFormActive, setIsFormActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const ciclosOpcoes = Array.from({ length: 100 }, (_, i) => (i + 1).toString());

  const isValidDDMMYYYY = (dateStr: string): boolean => {
    try {
      const parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());
      return isValid(parsedDate);
    } catch {
      return false;
    }
  };

  const resetForm = () => {
    setDataInicial(undefined);
    setDataFinal(undefined);
    setCiclo("");
    setCategoria("Selecionar");
    setSubCategoria("");
    setIsFormActive(false);
  };

  useEffect(() => {
    const hasInteracted = 
      dataInicial !== undefined ||
      dataFinal !== undefined ||
      ciclo !== "" ||
      categoria !== "Selecionar" ||
      subCategoria !== "";
    setIsFormActive(hasInteracted);
  }, [dataInicial, dataFinal, ciclo, categoria, subCategoria]);

  const handleSubmit = async () => {
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

    const formattedDataInicial = format(dataInicial, 'dd/MM/yyyy');
    const formattedDataFinal = format(dataFinal, 'dd/MM/yyyy');

    if (!isValidDDMMYYYY(formattedDataInicial)) {
      toast({
        title: "Campo inválido",
        description: "Data inicial deve estar no formato DD/MM/YYYY.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidDDMMYYYY(formattedDataFinal)) {
      toast({
        title: "Campo inválido",
        description: "Data final deve estar no formato DD/MM/YYYY.",
        variant: "destructive",
      });
      return;
    }

    const startDate = parse(formattedDataInicial, 'dd/MM/yyyy', new Date());
    const endDate = parse(formattedDataFinal, 'dd/MM/yyyy', new Date());
    if (startDate > endDate) {
      toast({
        title: "Erro nas datas",
        description: "A data inicial não pode ser posterior à data final.",
        variant: "destructive",
      });
      return;
    }

    if (!ciclo || isNaN(parseInt(ciclo)) || parseInt(ciclo) < 1) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, selecione um ciclo válido (>= 1).",
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
        data_inicial: formattedDataInicial,
        data_final: formattedDataFinal,
        ciclo: parseInt(ciclo, 10),
        categoria,
        subcategoria: subCategoria,
      };

      console.log('Enviando dados para o backend:', novaSemana);

      const response = await fetch('https://smi-api-production-fae2.up.railway.app/semana-estrategica', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaSemana),
      });

      console.log('Resposta do backend:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Resposta inválida do servidor. Verifique se o endpoint está correto.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao cadastrar semana estratégica');
      }

      const semanaCadastrada = await response.json();
      console.log('Semana cadastrada:', semanaCadastrada);

      resetForm();

      toast({
        title: "Sucesso!",
        description: "Semana Estratégica cadastrada com sucesso.",
      });

      onSubmit(semanaCadastrada);
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error.message);
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
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Data Inicial</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-bold text-black",
                    !dataInicial ? "bg-[#fde047] hover:bg-[#fef08a] transition-colors" : "bg-white"
                  )}
                  aria-label="Selecionar data inicial"
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
                    "w-full justify-start text-left font-bold text-black",
                    !dataFinal ? "bg-[#fde047] hover:bg-[#fef08a] transition-colors" : "bg-white"
                  )}
                  aria-label="Selecionar data final"
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
                aria-label="Selecionar ciclo"
              >
                <option value="" disabled>Escolha um ciclo</option>
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
            <label className="block text-sm font-medium mb-1">Área Principal</label>
            <div className="relative">
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full p-2 pl-3 pr-10 bg-dark-card border border-white/10 rounded text-sm text-white appearance-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30 hover:border-white/20"
                aria-label="Selecionar categoria"
              >
                {CATEGORIAS.filter(cat => cat !== 'Todas').map((cat) => (
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
            <label className="block text-sm font-medium mb-1">Área Complementar</label>
            <input
              type="text"
              value={subCategoria}
              onChange={(e) => setSubCategoria(e.target.value)}
              className="w-full p-2 bg-dark-card border border-white/10 rounded text-sm text-white focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30 hover:border-white/20"
              placeholder="Digite a subcategoria"
              aria-label="Digite a subcategoria"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 gap-2">
          {isFormActive && (
            <button
              onClick={resetForm}
              className="text-red-500 hover:text-red-400 transition-colors"
              aria-label="Cancelar cadastro e limpar formulário"
            >
              <X size={28} />
            </button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-[#fde047] hover:bg-[#fef08a] text-black font-bold transition-colors"
            aria-label="Cadastrar semana estratégica"
          >
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const SemanaEstrategica = () => {
  const [semanas, setSemanas] = useState<Semana[]>([]);
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<Partial<Semana>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('Todas');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  const { toast } = useToast();

  // Extrair datas estratégicas
  const strategicDates = useMemo(() => {
    const dates: Date[] = [];
    semanas.forEach(semana => {
      const startDate = typeof semana.data_inicial === 'string'
        ? parse(semana.data_inicial, 'dd/MM/yyyy', new Date())
        : semana.data_inicial;
      const endDate = typeof semana.data_final === 'string'
        ? parse(semana.data_final, 'dd/MM/yyyy', new Date())
        : semana.data_final;
      if (isValid(startDate) && isValid(endDate)) {
        const interval = eachDayOfInterval({ start: startDate, end: endDate });
        dates.push(...interval);
      }
    });
    return dates;
  }, [semanas]);

  // Definir modifiers para destacar datas estratégicas
  const isStrategicDate = (day: Date) => {
    return strategicDates.some((strategicDate) => isSameDay(day, strategicDate));
  };

  const modifiers = {
    nonStrategic: (day: Date) =>
      !isStrategicDate(day) &&
      !isSameDay(day, editedData.data_inicial || new Date(0)) &&
      !isSameDay(day, editedData.data_final || new Date(0)),
  };

  const modifiersClassNames = {
    nonStrategic: 'opacity-30',
  };

  // Fetch semanas
  useEffect(() => {
    const fetchSemanas = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('https://smi-api-production-fae2.up.railway.app/semana-estrategica');
        if (!response.ok) {
          if (response.status === 0) {
            throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
          }
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Resposta inválida do servidor. Verifique se o endpoint está correto.');
          }
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao buscar semanas estratégicas');
        }
        const semanasData = await response.json();
        console.log('Dados brutos recebidos do backend (semanas):', semanasData);
        if (!Array.isArray(semanasData)) {
          throw new Error('Resposta do servidor não contém uma lista de semanas estratégicas.');
        }
        setSemanas(semanasData.map((semana: Semana) => {
          const dataInicial = typeof semana.data_inicial === 'string' ? parse(semana.data_inicial, 'dd/MM/yyyy', new Date()) : new Date();
          const dataFinal = typeof semana.data_final === 'string' ? parse(semana.data_final, 'dd/MM/yyyy', new Date()) : new Date();
          return {
            ...semana,
            data_inicial: isValid(dataInicial) ? dataInicial : new Date(),
            data_final: isValid(dataFinal) ? dataFinal : new Date(),
          };
        }));
      } catch (error: any) {
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

    const fetchNoticias = async () => {
      try {
        const response = await fetch('https://smi-api-production-fae2.up.railway.app/noticias?all=true&estrategica=true');
        if (!response.ok) {
          throw new Error('Falha ao buscar notícias estratégicas');
        }
        const data = await response.json();
        const noticiasData = data.data.map((noticia: any) => ({
          id: noticia.id,
          data: parse(noticia.data, 'dd/MM/yyyy', new Date()),
          categoria: noticia.categoria,
          subcategoria: noticia.subcategoria,
          ciclo: noticia.ciclo,
          estrategica: noticia.estrategica,
        }));
        setNoticias(noticiasData);
      } catch (error: any) {
        console.error('Erro ao buscar notícias:', error.message);
        toast({
          title: "Erro ao carregar notícias",
          description: error.message || "Não foi possível carregar as notícias estratégicas. Tente novamente.",
          variant: "destructive",
        });
      }
    };

    fetchSemanas();
    fetchNoticias();
  }, [toast]);

  const semanasFiltradas = useMemo(() => {
    if (filtroCategoria === 'Todas') {
      return semanas;
    }
    return semanas.filter(semana => semana.categoria === filtroCategoria);
  }, [semanas, filtroCategoria]);

  const contarNoticias = (semana: Semana): number => {
    return noticias.filter(noticia => {
      return (
        noticia.ciclo === semana.ciclo &&
        noticia.categoria === semana.categoria &&
        noticia.subcategoria === semana.subcategoria &&
        noticia.estrategica
      );
    }).length;
  };

  const handleEdit = (semana: Semana) => {
    console.log('Botão de edição clicado para semana:', semana);
    try {
      const dataInicialStr = typeof semana.data_inicial === 'string' ? semana.data_inicial : format(semana.data_inicial, 'dd/MM/yyyy');
      const dataFinalStr = typeof semana.data_final === 'string' ? semana.data_final : format(semana.data_final, 'dd/MM/yyyy');

      console.log('Tentando parsear datas:', { dataInicialStr, dataFinalStr });

      const dataInicial = parse(dataInicialStr, 'dd/MM/yyyy', new Date());
      const dataFinal = parse(dataFinalStr, 'dd/MM/yyyy', new Date());

      if (!isValid(dataInicial) || !isValid(dataFinal)) {
        throw new Error(`Datas inválidas: inicial=${dataInicialStr}, final=${dataFinalStr}`);
      }

      setEditingId(semana.id);
      setEditedData({
        ...semana,
        data_inicial: dataInicial,
        data_final: dataFinal,
      });
      console.log('Estado de edição atualizado:', { editingId: semana.id, editedData: { ...semana, data_inicial: dataInicial, data_final: dataFinal } });
    } catch (error: any) {
      console.error('Erro ao iniciar edição:', error.message);
      toast({
        title: "Erro ao iniciar edição",
        description: error.message || "Não foi possível iniciar a edição da semana estratégica.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (id: number) => {
    console.log('Botão de salvar clicado para ID:', id);
    setIsSaving(true);
    try {
      if (!editedData.data_inicial || !isValid(editedData.data_inicial)) {
        throw new Error('Data inicial inválida ou não definida.');
      }
      if (!editedData.data_final || !isValid(editedData.data_final)) {
        throw new Error('Data final inválida ou não definida.');
      }
      if (!editedData.ciclo || isNaN(Number(editedData.ciclo)) || Number(editedData.ciclo) < 1) {
        throw new Error('Ciclo inválido ou não definido.');
      }
      if (!editedData.categoria || editedData.categoria === 'Selecionar') {
        throw new Error('Categoria inválida ou não selecionada.');
      }
      if (!editedData.subcategoria || !editedData.subcategoria.trim()) {
        throw new Error('Subcategoria inválida ou não definida.');
      }

      const startDate = parse(format(editedData.data_inicial as Date, 'dd/MM/yyyy'), 'dd/MM/yyyy', new Date());
      const endDate = parse(format(editedData.data_final as Date, 'dd/MM/yyyy'), 'dd/MM/yyyy', new Date());
      if (startDate > endDate) {
        throw new Error('A data inicial não pode ser posterior à data final.');
      }

      const formattedData = {
        data_inicial: format(editedData.data_inicial as Date, 'dd/MM/yyyy'),
        data_final: format(editedData.data_final as Date, 'dd/MM/yyyy'),
        ciclo: Number(editedData.ciclo),
        categoria: editedData.categoria,
        subcategoria: editedData.subcategoria,
      };

      console.log('Enviando atualização para o backend:', formattedData);

      const response = await fetch(`https://smi-api-production-fae2.up.railway.app/semana-estrategica/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });

      console.log('Resposta do backend (PUT):', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Falha ao atualizar semana estratégica';
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const updatedSemana = await response.json();
      console.log('Semana atualizada:', updatedSemana);

      setSemanas(semanas.map(s => s.id === id ? {
        ...updatedSemana,
        data_inicial: parse(updatedSemana.data_inicial, 'dd/MM/yyyy', new Date()),
        data_final: parse(updatedSemana.data_final, 'dd/MM/yyyy', new Date()),
      } : s));
      setEditingId(null);
      setEditedData({});

      toast({
        title: "Sucesso!",
        description: "Semana atualizada com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao atualizar semana estratégica:', error.message);
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar a Semana Estratégica. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta semana estratégica?')) {
      return;
    }

    setIsSaving(true);
    try {
      console.log('Enviando requisição de exclusão para o backend:', { id });

      const response = await fetch(`https://smi-api-production-fae2.up.railway.app/semana-estrategica/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('Resposta do backend (DELETE):', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao excluir semana estratégica');
        }
        throw new Error('Resposta inválida do servidor. Verifique se o endpoint está correto.');
      }

      setSemanas(semanas.filter(s => s.id !== id));
      setEditingId(null);
      setEditedData({});

      toast({
        title: "Sucesso!",
        description: "Semana estratégica excluída com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao excluir:', error.message);
      toast({
        title: "Erro ao excluir",
        description: error.message || "Não foi possível excluir a Semana Estratégica. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    console.log('Cancelando edição, limpando estado.');
    setEditingId(null);
    setEditedData({});
  };

  const handleFieldChange = (field: keyof Semana, value: any) => {
    console.log('Atualizando campo:', { field, value });
    setEditedData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const adicionarSemana = (novaSemana: Semana) => {
    const parsedSemana = {
      ...novaSemana,
      data_inicial: parse(novaSemana.data_inicial as string, 'dd/MM/yyyy', new Date()),
      data_final: parse(novaSemana.data_final as string, 'dd/MM/yyyy', new Date()),
    };
    console.log('Adicionando semana ao estado:', novaSemana);
    setSemanas(prev => [...prev, parsedSemana]);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar />
      <main className="p-6 md:p-8">
        <div className="mb-6 flex items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Semana Estratégica</h1>
            <p className="text-gray-400">Cadastro e gerenciamento de semanas estratégicas</p>
          </div>
          <div className="ml-auto">
            <DatePickerSemana
              onChange={setDateRange}
              strategicDates={strategicDates}
            />
          </div>
        </div>

        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <TotalNoticiasSemana dateRange={dateRange} />
          </div>
          <div className="flex-1">
            <SemanasCadastradas dateRange={dateRange} />
          </div>
          <div className="flex-1">
            <PontuacaoSemana dateRange={dateRange} />
          </div>
        </div>

        <div className="mb-6 w-full">
          <GraficoCategoria dateRange={dateRange} />
        </div>

        <AddSemana onAddSemana={adicionarSemana} />

        <div className="dashboard-card">
          <h2 className="text-lg font-semibold mb-4">Semanas Estratégicas Cadastradas</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Filtrar por Área Principal</label>
            <div className="relative w-64">
              <select
                value={filtroCategoria}
                onChange={(e) => {
                  console.log('Filtro de categoria alterado para:', e.target.value);
                  setFiltroCategoria(e.target.value);
                }}
                className="w-full p-2 pl-3 pr-10 bg-dark-card border border-white/10 rounded text-sm text-white appearance-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30 hover:border-white/20"
                aria-label="Filtrar por categoria"
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

          {isLoading ? (
            <div className="flex items-center justify-center h-[300px]">
              <Turtle className="w-8 h-8 text-[#CAF10A] animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-red-400">Erro ao carregar dados: {error}</p>
            </div>
          ) : semanasFiltradas.length === 0 ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-gray-400">
                {filtroCategoria === 'Todas'
                  ? 'Nenhuma semana estratégica encontrada'
                  : `Nenhuma semana estratégica encontrada para a categoria "${filtroCategoria}"`}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 border-b border-white/10">
                  <th className="py-2 px-4">Data Inicial</th>
                  <th className="py-2 px-4">Data Final</th>
                  <th className="py-2 px-4">Ciclo</th>
                  <th className="py-2 px-4">Área Principal</th>
                  <th className="py-2 px-4">Área Complementar</th>
                  <th className="py-2 px-4">Notícias Relacionadas</th>
                  <th className="py-2 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {semanasFiltradas.map((semana) => (
                  <tr key={semana.id} className="border-b border-white/10">
                    <td className="py-2 px-4">
                      {editingId === semana.id ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="h-8 p-2 text-xs border-white/20 bg-[#fde047] hover:bg-[#fef08a] text-black transition-colors"
                              aria-label="Editar data inicial"
                            >
                              {editedData.data_inicial ? format(editedData.data_inicial as Date, 'dd/MM/yyyy') : 'Selecionar'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-4 bg-dark-card border border-yellow-500/50 text-white rounded-xl shadow-lg" align="start">
                            <Calendar
                              mode="single"
                              selected={editedData.data_inicial as Date}
                              onSelect={(date) => handleFieldChange('data_inicial', date)}
                              locale={ptBR}
                              className="rounded-lg bg-dark-card"
                              classNames={{
                                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                                month: 'space-y-4',
                                caption: 'flex justify-center pt-1 relative items-center text-white',
                                caption_label: 'text-sm font-medium',
                                nav: 'space-x-1 flex items-center',
                                nav_button: 'h-7 w-7 bg-dark-card hover:bg-yellow-500/20 text-white rounded-md flex items-center justify-center transition-all',
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
                                day_hidden: 'invisible',
                              }}
                              modifiers={modifiers}
                              modifiersClassNames={modifiersClassNames}
                            />
                          </PopoverContent>
                        </Popover>
                      ) : (
                        format(semana.data_inicial as Date, 'dd/MM/yyyy')
                      )}
                    </td>

                    <td className="py-2 px-4">
                      {editingId === semana.id ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="h-8 p-2 text-xs border-white/20 bg-[#fde047] hover:bg-[#fef08a] text-black transition-colors"
                              aria-label="Editar data final"
                            >
                              {editedData.data_final ? format(editedData.data_final as Date, 'dd/MM/yyyy') : 'Selecionar'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-4 bg-dark-card border border-yellow-500/50 text-white rounded-xl shadow-lg" align="start">
                            <Calendar
                              mode="single"
                              selected={editedData.data_final as Date}
                              onSelect={(date) => handleFieldChange('data_final', date)}
                              locale={ptBR}
                              className="rounded-lg bg-dark-card"
                              classNames={{
                                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                                month: 'space-y-4',
                                caption: 'flex justify-center pt-1 relative items-center text-white',
                                caption_label: 'text-sm font-medium',
                                nav: 'space-x-1 flex items-center',
                                nav_button: 'h-7 w-7 bg-dark-card hover:bg-yellow-500/20 text-white rounded-md flex items-center justify-center transition-all',
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
                                day_hidden: 'invisible',
                              }}
                              modifiers={modifiers}
                              modifiersClassNames={modifiersClassNames}
                            />
                          </PopoverContent>
                        </Popover>
                      ) : (
                        format(semana.data_final as Date, 'dd/MM/yyyy')
                      )}
                    </td>

                    <td className="py-2 px-4">
                      {editingId === semana.id ? (
                        <select
                          value={editedData.ciclo || ''}
                          onChange={(e) => handleFieldChange('ciclo', parseInt(e.target.value))}
                          className="bg-dark-card border border-white/20 rounded px-2 py-1"
                          aria-label="Editar ciclo"
                        >
                          {Array.from({ length: 100 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                      ) : (
                        semana.ciclo
                      )}
                    </td>

                    <td className="py-2 px-4">
                      {editingId === semana.id ? (
                        <select
                          value={editedData.categoria || ''}
                          onChange={(e) => handleFieldChange('categoria', e.target.value)}
                          className="bg-dark-card border border-white/20 rounded px-2 py-1"
                          aria-label="Editar categoria"
                        >
                          {CATEGORIAS.filter(cat => cat !== 'Todas').map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      ) : (
                        semana.categoria || '-'
                      )}
                    </td>

                    <td className="py-2 px-4">
                      {editingId === semana.id ? (
                        <input
                          type="text"
                          value={editedData.subcategoria || ''}
                          onChange={(e) => handleFieldChange('subcategoria', e.target.value)}
                          className="bg-dark-card border border-white/20 rounded px-2 py-1 w-full"
                          aria-label="Editar subcategoria"
                        />
                      ) : (
                        semana.subcategoria || '-'
                      )}
                    </td>

                    <td className="py-2 px-4">
                      {contarNoticias(semana)}
                    </td>

                    <td className="py-2 px-4">
                      {editingId === semana.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              console.log('Clicou no botão de salvar para ID:', semana.id);
                              handleSave(semana.id);
                            }}
                            className="text-[#CAF10A] hover:text-[#CAF163]"
                            disabled={isSaving}
                            aria-label="Salvar alterações"
                          >
                            <Save size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(semana.id)}
                            className="text-[#f5a340] hover:text-[#f5b86e]"
                            disabled={isSaving}
                            aria-label="Excluir semana estratégica"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-red-400 hover:text-red-300"
                            disabled={isSaving}
                            aria-label="Cancelar edição"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            console.log('Clicou no botão de edição para ID:', semana.id);
                            handleEdit(semana);
                          }}
                          className="text-blue-500 hover:text-blue-400"
                          aria-label="Editar semana estratégica"
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