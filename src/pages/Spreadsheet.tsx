import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import DataTable from '@/components/DataTable';
import DatePicker from '@/components/DateRangePicker';
import { ThumbsUp, ThumbsDown, Minus, ChevronDown, CircleArrowLeft, CircleCheckBig, CircleX, ShieldPlus, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Estrategicas from '@/components/planilha/Estrategicas';
import { format } from 'date-fns';
import { Noticia, ColumnDef } from '@/types/noticia';

// Centralizar a URL base
const API_BASE_URL = 'https://smi-api-production-fae2.up.railway.app';

const TEMAS = [
  'Agricultura',
  'Social',
  'Segurança Pública',
  'Saúde',
  'Política',
  'Meio Ambiente',
  'Infraestrutura',
  'Educação',
  'Economia',
  'Cultura',
];

const AVALIACOES = [
  { valor: 'Positiva', cor: '#F2FCE2', icone: ThumbsUp },
  { valor: 'Neutra', cor: '#F1F0FB', icone: Minus },
  { valor: 'Negativa', cor: '#FFDEE2', icone: ThumbsDown },
];

const RELEVANCIA = [
  { valor: 'Útil', cor: '#F2FCE2', icone: CircleCheckBig },
  { valor: 'Lixo', cor: '#FFDEE2', icone: CircleX },
  { valor: 'Suporte', cor: '#B8E2F4', icone: ShieldPlus },
];

const MENSAGEM_PADRAO = 'Selecionar';

// Tipagem para as props do DataTable
interface DataTableProps {
  data: Noticia[];
  columns: ColumnDef[];
  updateTema: (id: string, tema: string) => void;
  updateAvaliacao: (id: string, avaliacao: string) => void;
  currentDate: string | null;
  hasNext: boolean;
  hasPrevious: boolean;
  totalItems: number;
  onNext: () => void;
  onPrevious: () => void;
  isLoading: boolean;
}

// Tipagem para as props do componente TituloCell
interface TituloCellProps {
  row: Noticia;
}

// Componente para renderizar o título com link externo (exportado para reutilização)
export const TituloCell: React.FC<TituloCellProps> = ({ row }) => (
  <a
    href={row.link}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
  >
    {row.titulo}
    <ExternalLink className="h-4 w-4 ml-2 inline-block" />
  </a>
);

// Componente para o dropdown de Relevância
function RelevanciaCell({ row, setNoticias }: { row: Noticia; setNoticias: React.Dispatch<React.SetStateAction<Noticia[]>> }) {
  const { id, relevancia } = row;
  const [relevSelecionada, setRelevSelecionada] = useState<string>(
    relevancia === 'Útil' ? 'Útil' : relevancia === 'Lixo' ? 'Lixo' : relevancia === 'Suporte' ? 'Suporte' : 'Selecionar'
  );
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async (novaRelevancia: string) => {
    const valorEnviado = novaRelevancia === 'Selecionar' ? null : novaRelevancia;
    if (valorEnviado !== relevancia) {
      setIsSaving(true);
      try {
        const response = await fetch(`${API_BASE_URL}/noticias/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ relevancia: valorEnviado }),
        });
        if (!response.ok) throw new Error('Falha ao salvar relevância');

        setNoticias((prevNoticias) =>
          prevNoticias.map((noticia) =>
            noticia.id === id ? { ...noticia, relevancia: valorEnviado } : noticia
          )
        );
      } catch (error: any) {
        toast({
          title: 'Erro ao salvar',
          description: 'Não foi possível salvar a relevância. Tente novamente.',
          variant: 'destructive',
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const relevanciaObj = RELEVANCIA.find((r) => r.valor === relevSelecionada);
  const IconeRelevancia = relevanciaObj?.icone;

  return (
    <div className="relative">
      <select
        value={relevSelecionada}
        onChange={(e) => {
          const novaRelevancia = e.target.value;
          setRelevSelecionada(novaRelevancia);
          handleSave(novaRelevancia);
        }}
        disabled={isSaving}
        className={`p-1 pl-8 pr-8 border rounded text-sm w-full min-w-[140px] text-left appearance-none focus:ring-1 transition-all ${
          relevSelecionada === 'Útil'
            ? 'bg-[#F2FCE2] text-green-800 border-green-300 focus:border-green-400 focus:ring-green-400/30 hover:border-green-400'
            : relevSelecionada === 'Lixo'
            ? 'bg-[#FFDEE2] text-red-800 border-red-300 focus:border-red-400 focus:ring-red-400/30 hover:border-red-400'
            : relevSelecionada === 'Suporte'
            ? 'bg-[#B8E2F4] text-blue-800 border-blue-300 focus:border-blue-400 focus:ring-blue-400/30 hover:border-blue-400'
            : 'bg-dark-card border-white/10 text-white focus:border-blue-400/50 focus:ring-blue-400/30 hover:border-white/20'
        }`}
      >
        <option value="Selecionar" className="text-left">{MENSAGEM_PADRAO}</option>
        {RELEVANCIA.map((relevancia) => (
          <option key={relevancia.valor} value={relevancia.valor} className="text-left">
            {relevancia.valor}
          </option>
        ))}
      </select>
      {IconeRelevancia && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2">
          <IconeRelevancia
            className={`h-4 w-4 ${
              relevSelecionada === 'Útil'
                ? 'text-green-600'
                : relevSelecionada === 'Lixo'
                ? 'text-red-600'
                : relevSelecionada === 'Suporte'
                ? 'text-blue-600'
                : 'text-gray-600'
            }`}
          />
        </div>
      )}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/60">
        <ChevronDown className={`h-4 w-4 ${relevSelecionada ? 'text-gray-600' : 'text-white/60'}`} />
      </div>
    </div>
  );
}

// Componente para o dropdown de Tema
function TemaCell({ row, updateTema }: { row: Noticia; updateTema: (id: string, tema: string) => void }) {
  const { id, tema } = row;
  const [temaSelecionado, setTemaSelecionado] = useState<string>(tema || '');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async (novoTema: string) => {
    const valorEnviado = novoTema === '' ? null : novoTema;
    if (valorEnviado !== tema) {
      setIsSaving(true);
      try {
        const response = await fetch(`${API_BASE_URL}/noticias/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tema: valorEnviado }),
        });
        if (!response.ok) throw new Error('Falha ao salvar tema');
        updateTema(id.toString(), valorEnviado || '');
      } catch (error: any) {
        toast({
          title: 'Erro ao salvar',
          description: 'Não foi possível salvar o tema. Tente novamente.',
          variant: 'destructive',
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="relative">
      <select
        value={temaSelecionado}
        onChange={(e) => {
          const novoTema = e.target.value;
          setTemaSelecionado(novoTema);
          handleSave(novoTema);
        }}
        disabled={isSaving}
        className="p-1 pl-2 pr-8 bg-dark-card border border-white/10 rounded text-sm text-white w-full min-w-[140px] text-left appearance-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30 hover:border-white/20 transition-all"
      >
        <option value="" className="text-left">{MENSAGEM_PADRAO}</option>
        {TEMAS.map((tema) => (
          <option key={tema} value={tema} className="text-left">
            {tema}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/60">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
}

// Componente para o dropdown de Avaliação
function AvaliacaoCell({ row, updateAvaliacao, setNoticias }: { row: Noticia; updateAvaliacao: (id: string, avaliacao: string) => void; setNoticias: React.Dispatch<React.SetStateAction<Noticia[]>> }) {
  const { id, avaliacao, pontos } = row;
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState<string>(avaliacao || '');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async (novaAvaliacao: string) => {
    const valorEnviado = novaAvaliacao === '' ? null : novaAvaliacao;
    if (valorEnviado !== avaliacao) {
      setIsSaving(true);
      try {
        const response = await fetch(`${API_BASE_URL}/noticias/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avaliacao: valorEnviado }),
        });
        if (!response.ok) throw new Error('Falha ao salvar a avaliação');

        const pontosBrutos = Math.abs(pontos || 0);
        const novosPontos = valorEnviado === 'Negativa' ? -pontosBrutos : pontosBrutos;
        updateAvaliacao(id.toString(), valorEnviado || '');
      } catch (error: any) {
        toast({
          title: 'Erro ao salvar',
          description: 'Não foi possível salvar a avaliação. Tente novamente.',
          variant: 'destructive',
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const avaliacaoObj = AVALIACOES.find((a) => a.valor === avaliacaoSelecionada);
  const IconeAvaliacao = avaliacaoObj?.icone;

  return (
    <div className="relative">
      <select
        value={avaliacaoSelecionada}
        onChange={(e) => {
          const novaAvaliacao = e.target.value;
          setAvaliacaoSelecionada(novaAvaliacao);
          const pontosBrutos = Math.abs(pontos || 0);
          const novosPontos = novaAvaliacao === 'Negativa' ? -pontosBrutos : pontosBrutos;
          setNoticias((prevNoticias) =>
            prevNoticias.map((noticia) =>
              noticia.id === id
                ? { ...noticia, avaliacao: novaAvaliacao, pontos: novosPontos }
                : noticia
            )
          );
          handleSave(novaAvaliacao);
        }}
        disabled={isSaving}
        className={`p-1 pl-8 pr-8 border rounded text-sm w-full min-w-[140px] text-left appearance-none focus:ring-1 transition-all ${
          avaliacaoSelecionada === 'Positiva'
            ? 'bg-[#F2FCE2] text-green-800 border-green-300 focus:border-green-400 focus:ring-green-400/30 hover:border-green-400'
            : avaliacaoSelecionada === 'Negativa'
            ? 'bg-[#FFDEE2] text-red-800 border-red-300 focus:border-red-400 focus:ring-red-400/30 hover:border-red-400'
            : avaliacaoSelecionada === 'Neutra'
            ? 'bg-[#F1F0FB] text-gray-800 border-gray-300 focus:border-gray-400 focus:ring-gray-400/30 hover:border-gray-400'
            : 'bg-dark-card border-white/10 text-white focus:border-blue-400/50 focus:ring-blue-400/30 hover:border-white/20'
        }`}
      >
        <option value="" className="text-left">{MENSAGEM_PADRAO}</option>
        {AVALIACOES.map((avaliacao) => (
          <option key={avaliacao.valor} value={avaliacao.valor} className="text-left">
            {avaliacao.valor}
          </option>
        ))}
      </select>
      {IconeAvaliacao && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2">
          <IconeAvaliacao
            className={`h-4 w-4 ${
              avaliacaoSelecionada === 'Positiva'
                ? 'text-green-600'
                : avaliacaoSelecionada === 'Negativa'
                ? 'text-red-600'
                : 'text-gray-600'
            }`}
          />
        </div>
      )}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/60">
        <ChevronDown className={`h-4 w-4 ${avaliacaoSelecionada ? 'text-gray-600' : 'text-white/60'}`} />
      </div>
    </div>
  );
}

// Componente para exibir os pontos
function PontosCell({ row }: { row: Noticia }) {
  const { avaliacao, pontos } = row;
  if (!avaliacao) return <span className="text-gray-400">-</span>;

  const valorPontos = avaliacao === 'Negativa' ? -Math.abs(pontos || 0) : pontos || 0;
  return (
    <span
      className={`font-medium ${
        valorPontos < 0 ? 'text-red-500' : valorPontos > 0 ? 'text-green-500' : 'text-gray-400'
      }`}
    >
      {valorPontos}
    </span>
  );
}

// Componente para a célula de Estratégica
function EstrategicaCell({ row, setNoticias }: { row: Noticia; setNoticias: React.Dispatch<React.SetStateAction<Noticia[]>> }) {
  const { id, estrategica } = row;
  const [isChecked, setIsChecked] = useState(estrategica || false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleChange = async (checked: boolean) => {
    setIsChecked(checked);
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/noticias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estrategica: checked }),
      });
      if (!response.ok) throw new Error('Falha ao salvar estratégica');
      setNoticias((prevNoticias) =>
        prevNoticias.map((noticia) =>
          noticia.id === id ? { ...noticia, estrategica: checked } : noticia
        )
      );
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar a marcação estratégica. Tente novamente.',
        variant: 'destructive',
      });
      setIsChecked(estrategica || false); // Reverter em caso de erro
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Checkbox
        checked={isChecked}
        onCheckedChange={handleChange}
        disabled={isSaving}
        className="border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
      />
    </div>
  );
}

// Definição das colunas padrão
const getColumns = (
  noticias: Noticia[],
  setNoticias: React.Dispatch<React.SetStateAction<Noticia[]>>,
  updateTema: (id: string, tema: string) => void,
  updateAvaliacao: (id: string, avaliacao: string) => void
): ColumnDef[] => [
  {
    id: 'relevancia',
    header: 'Utilidade',
    accessorKey: 'relevancia',
    sortable: true,
    cell: ({ row }) => <RelevanciaCell row={row} setNoticias={setNoticias} />,
  },
  {
    id: 'data',
    header: 'Data',
    accessorKey: 'data',
    sortable: true,
  },
  {
    id: 'portal',
    header: 'Portal',
    accessorKey: 'portal',
    sortable: true,
  },
  {
    id: 'titulo',
    header: 'Título',
    accessorKey: 'titulo',
    sortable: true,
    cell: ({ row }) => <TituloCell row={row} />,
  },
  {
    id: 'tema',
    header: 'Tema',
    accessorKey: 'tema',
    sortable: true,
    cell: ({ row }) => <TemaCell row={row} updateTema={updateTema} />,
  },
  {
    id: 'avaliacao',
    header: 'Avaliação',
    accessorKey: 'avaliacao',
    sortable: true,
    cell: ({ row }) => <AvaliacaoCell row={row} updateAvaliacao={updateAvaliacao} setNoticias={setNoticias} />,
  },
  {
    id: 'pontos',
    header: 'Pontos',
    accessorKey: 'pontos',
    sortable: true,
    cell: ({ row }) => <PontosCell row={row} />,
  },
  {
    id: 'estrategica',
    header: 'Estratégica',
    accessorKey: 'estrategica',
    sortable: true,
    cell: ({ row }) => <EstrategicaCell row={row} setNoticias={setNoticias} />,
  },
];

// Tipagem para o retorno do componente Estrategicas
interface EstrategicasReturn {
  columns: ColumnDef[];
  isLoading: boolean;
}

// Componente principal
const Spreadsheet: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [filtroAtivo, setFiltroAtivo] = useState<'Nenhum' | 'Lixo' | 'Estrategica'>('Nenhum');

  // Integração com o componente Estrategicas
  const estrategicas: EstrategicasReturn = Estrategicas({ noticias, setNoticias });

  const toggleFiltroLixo = () => {
    const novoFiltro = filtroAtivo === 'Lixo' ? 'Nenhum' : 'Lixo';
    setFiltroAtivo(novoFiltro);
    setCurrentDate(null); // Resetar data para buscar a mais recente
  };

  const toggleFiltroEstrategica = () => {
    const novoFiltro = filtroAtivo === 'Estrategica' ? 'Nenhum' : 'Estrategica';
    setFiltroAtivo(novoFiltro);
    setCurrentDate(null); // Resetar data para buscar a mais recente
  };

  const updateTema = (id: string, novoTema: string) => {
    setNoticias((prevNoticias) =>
      prevNoticias.map((noticia) =>
        noticia.id === Number(id) ? { ...noticia, tema: novoTema || null } : noticia
      )
    );
  };

  const updateAvaliacao = (id: string, novaAvaliacao: string) => {
    setNoticias((prevNoticias) =>
      prevNoticias.map((noticia) => {
        if (noticia.id === Number(id)) {
          const pontosBrutos = Math.abs(noticia.pontos || 0);
          const novosPontos = novaAvaliacao === 'Negativa' ? -pontosBrutos : pontosBrutos;
          return { ...noticia, avaliacao: novaAvaliacao || null, pontos: novosPontos };
        }
        return noticia;
      })
    );
  };

  useEffect(() => {
    const fetchNoticias = async () => {
      setIsLoading(true);
      setError(null);

      let url = `${API_BASE_URL}/noticias`;
      if (selectedDate) {
        const dateFormatted = format(selectedDate, 'yyyy-MM-dd');
        url += `?date=${dateFormatted}`;
      }
      if (filtroAtivo === 'Lixo') {
        url += `${selectedDate ? '&' : '?'}relevancia=Lixo`;
      } else if (filtroAtivo === 'Estrategica') {
        url += `${selectedDate ? '&' : '?'}estrategica=true`;
      }

      console.log('Buscando notícias com URL:', url);

      try {
        const response = await fetch(url);
        console.log('Resposta da API:', response.status, response.statusText);
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
        }
        const responseData = await response.json();
        console.log('Dados recebidos:', responseData);

        const { data, meta } = responseData;
        if (Array.isArray(data)) {
          const dataWithIds = data.map((item: any, index: number) => ({
            ...item,
            id: item.id || `noticia-${index}`,
            pontos: item.pontos || 0,
          }));
          console.log('Notícias processadas:', dataWithIds);
          setNoticias(dataWithIds);
          setTotalItems(meta?.total || data.length);
          setCurrentDate(meta?.date || null);
          setHasNext(meta?.hasNext || false);
          setHasPrevious(meta?.hasPrevious || false);
        } else {
          console.warn('Dados não são um array:', data);
          setNoticias([]);
          setTotalItems(0);
          setCurrentDate(null);
          setHasNext(false);
          setHasPrevious(false);
          setError('Formato de dados inesperado retornado pela API.');
        }
      } catch (error: any) {
        console.error('Erro ao buscar notícias:', error.message);
        setError(error.message);
        toast({
          title: 'Erro ao buscar notícias',
          description: error.message,
          variant: 'destructive',
        });
        setNoticias([]);
        setTotalItems(0);
        setCurrentDate(null);
        setHasNext(false);
        setHasPrevious(false);
      } finally {
        setIsLoading(false);
        console.log('Finalizado fetchNoticias, isLoading:', false);
      }
    };

    fetchNoticias();
  }, [selectedDate, filtroAtivo, toast]);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    setCurrentDate(null); // Resetar navegação por before/after
  };

  const handleNext = () => {
    if (hasNext && currentDate) {
      // Converter DD/MM/YYYY para YYYY-MM-DD
      const [day, month, year] = currentDate.split('/');
      const dateFormatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      setCurrentDate(null); // Limpar data atual
      let url = `${API_BASE_URL}/noticias?before=${dateFormatted}`;
      if (selectedDate) {
        const selectedDateFormatted = format(selectedDate, 'yyyy-MM-dd');
        url += `&date=${selectedDateFormatted}`;
      }
      if (filtroAtivo === 'Lixo') {
        url += '&relevancia=Lixo';
      } else if (filtroAtivo === 'Estrategica') {
        url += '&estrategica=true';
      }
      fetch(url)
        .then(response => {
          if (!response.ok) throw new Error('Falha ao buscar próxima data');
          return response.json();
        })
        .then(({ data, meta }) => {
          const dataWithIds = data.map((item: any, index: number) => ({
            ...item,
            id: item.id || `noticia-${index}`,
            pontos: item.pontos || 0,
          }));
          setNoticias(dataWithIds);
          setTotalItems(meta?.total || data.length);
          setCurrentDate(meta?.date || null);
          setHasNext(meta?.hasNext || false);
          setHasPrevious(meta?.hasPrevious || false);
        })
        .catch(error => {
          toast({
            title: 'Erro ao buscar próxima data',
            description: error.message,
            variant: 'destructive',
          });
        });
    }
  };

  const handlePrevious = () => {
    if (hasPrevious && currentDate) {
      // Converter DD/MM/YYYY para YYYY-MM-DD
      const [day, month, year] = currentDate.split('/');
      const dateFormatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      setCurrentDate(null); // Limpar data atual
      let url = `${API_BASE_URL}/noticias?after=${dateFormatted}`;
      if (selectedDate) {
        const selectedDateFormatted = format(selectedDate, 'yyyy-MM-dd');
        url += `&date=${selectedDateFormatted}`;
      }
      if (filtroAtivo === 'Lixo') {
        url += '&relevancia=Lixo';
      } else if (filtroAtivo === 'Estrategica') {
        url += '&estrategica=true';
      }
      fetch(url)
        .then(response => {
          if (!response.ok) throw new Error('Falha ao buscar data anterior');
          return response.json();
        })
        .then(({ data, meta }) => {
          const dataWithIds = data.map((item: any, index: number) => ({
            ...item,
            id: item.id || `noticia-${index}`,
            pontos: item.pontos || 0,
          }));
          setNoticias(dataWithIds);
          setTotalItems(meta?.total || data.length);
          setCurrentDate(meta?.date || null);
          setHasNext(meta?.hasNext || false);
          setHasPrevious(meta?.hasPrevious || false);
        })
        .catch(error => {
          toast({
            title: 'Erro ao buscar data anterior',
            description: error.message,
            variant: 'destructive',
          });
        });
    }
  };

  const columns = filtroAtivo === 'Estrategica' ? estrategicas.columns : getColumns(noticias, setNoticias, updateTema, updateAvaliacao);

  console.log('Renderizando Spreadsheet, estado:', {
    isLoading,
    estrategicasIsLoading: estrategicas.isLoading,
    noticiasLength: noticias.length,
    error,
    filtroAtivo,
    currentDate,
    hasNext,
    hasPrevious,
  });

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar />
      <main className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Planilha de Matérias</h1>
            <p className="text-gray-400">Gerenciamento e análise de notícias</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button
              variant="default"
              onClick={toggleFiltroEstrategica}
              className={
                filtroAtivo === 'Estrategica'
                  ? 'bg-[#FAF9BF] hover:bg-[#FAF9BF]/90 text-yellow-800'
                  : 'bg-[#FAF9BF] hover:bg-[#FAF9BF]/90 text-yellow-800'
              }
            >
              {filtroAtivo === 'Estrategica' ? 'Voltar' : 'Abrir Estratégicas'}
              {filtroAtivo === 'Estrategica' ? <CircleArrowLeft className="ml-2 h-4 w-4" /> : null}
            </Button>
            <Button
              variant="default"
              onClick={toggleFiltroLixo}
              className={
                filtroAtivo === 'Lixo'
                  ? 'bg-[#E2F2FC] hover:bg-[#E2F2FC]/90 text-blue-800'
                  : 'bg-[#FFDEE2] hover:bg-[#FFDEE2]/90 text-red-800'
              }
            >
              {filtroAtivo === 'Lixo' ? 'Voltar' : 'Abrir Lixos'}
              {filtroAtivo === 'Lixo' ? (
                <CircleArrowLeft className="ml-2 h-4 w-4" />
              ) : (
                <CircleX className="ml-2 h-4 w-4" />
              )}
            </Button>
            <DatePicker onChange={handleDateChange} />
          </div>
        </div>
        <div className="dashboard-card">
          {isLoading || estrategicas.isLoading ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-gray-400">Carregando dados...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-red-400">Erro ao carregar dados: {error}</p>
            </div>
          ) : noticias.length === 0 ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-gray-400">Nenhuma notícia encontrada</p>
            </div>
          ) : (
            <DataTable
              data={noticias}
              columns={columns}
              updateTema={updateTema}
              updateAvaliacao={updateAvaliacao}
              currentDate={currentDate}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
              totalItems={totalItems}
              onNext={handleNext}
              onPrevious={handlePrevious}
              isLoading={isLoading}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Spreadsheet;
