import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import DataTable from '@/components/DataTable';
import DatePicker from '@/components/DateRangePicker';
import DatePickerEstrategicas from '@/components/DatePickerEstrategicas';
import DatePickerLixeira from '@/components/DatePickerLixeira';
import DatePickerSuporte from '@/components/DatePickerSuporte';
import { Smile, Frown, Meh, ChevronDown, CircleArrowLeft, CircleCheckBig, Trash2, Lightbulb, ExternalLink, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Estrategicas from '@/components/planilha/Estrategicas';
import Lixeira from '@/components/planilha/Lixeira';
import Suporte from '@/components/planilha/Suporte';
import { format, parse } from 'date-fns';
import { Noticia, ColumnDef } from '@/types/noticia';

// Centralizar a URL base
const API_BASE_URL = 'http://localhost:3000';

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
  { valor: 'Positiva', cor: '#F2FCE2', icone: Smile },
  { valor: 'Neutra', cor: '#F1F0FB', icone: Meh },
  { valor: 'Negativa', cor: '#FFDEE2', icone: Frown },
];

const RELEVANCIA = [
  { valor: 'Útil', cor: '#CAF10A', icone: CircleCheckBig },
  { valor: 'Lixo', cor: '#FFFFFF', icone: Trash2 },
  { valor: 'Suporte', cor: '#FFFFFF', icone: Lightbulb },
];

const MENSAGEM_PADRAO = 'Selecionar';

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
  onRowRemove?: (id: string, callback: () => void) => void;
  filterMode?: 'Nenhum' | 'Lixo' | 'Estrategica' | 'Suporte';
}

export const TituloCell: React.FC<{ row: Noticia }> = ({ row }) => (
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

function RelevanciaCell({
  row,
  setNoticias,
  onRowRemove,
  filterMode,
}: {
  row: Noticia;
  setNoticias: React.Dispatch<React.SetStateAction<Noticia[]>>;
  onRowRemove?: (id: string, callback: () => void) => void;
  filterMode?: 'Lixo' | 'Suporte' | 'Nenhum';
}) {
  const { id, relevancia } = row;
  const [relevSelecionada, setRelevSelecionada] = useState<string>(
    relevancia || 'Selecionar'
  );
  const [tempRelevancia, setTempRelevancia] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(relevSelecionada === 'Selecionar');
  const { toast } = useToast();

  const handleSave = async (novaRelevancia: string) => {
    const valorEnviado = novaRelevancia === 'Selecionar' ? null : novaRelevancia;
    setIsSaving(true);
    setTempRelevancia(novaRelevancia);
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
      setRelevSelecionada(novaRelevancia);
      if (onRowRemove) {
        const shouldRemove =
          (filterMode === 'Lixo' && novaRelevancia !== 'Lixo') ||
          (filterMode === 'Suporte' && novaRelevancia !== 'Suporte') ||
          (filterMode === 'Nenhum' && (novaRelevancia === 'Lixo' || novaRelevancia === 'Suporte'));
        if (shouldRemove) {
          onRowRemove(id.toString(), () => {
            setNoticias((prevNoticias) =>
              prevNoticias.filter((noticia) => noticia.id !== id)
            );
          });
        }
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar a relevância. Tente novamente.',
        variant: 'destructive',
      });
      setTempRelevancia(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelect = (novaRelevancia: string) => {
    handleSave(novaRelevancia);
    setIsMenuOpen(novaRelevancia === 'Selecionar');
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir comportamento padrão
    if (relevSelecionada !== 'Selecionar') {
      handleSelect('Selecionar');
    } else {
      setIsMenuOpen(true);
    }
  };

  const relevanciaAtual = isSaving && tempRelevancia ? tempRelevancia : relevSelecionada;
  const relevanciaObj = RELEVANCIA.find((r) => r.valor === relevanciaAtual);
  const IconeRelevancia = relevanciaObj?.icone;

  return (
    <div className="flex justify-center items-center h-full">
      {isMenuOpen ? (
        <div className="flex gap-2">
          {RELEVANCIA.map((relevancia) => {
            const Icone = relevancia.icone;
            const isUtil = relevancia.valor === 'Útil';
            const isLixo = relevancia.valor === 'Lixo';
            const isSuporte = relevancia.valor === 'Suporte';
            return (
              <span
                key={relevancia.valor}
                onClick={(e) => { e.preventDefault(); handleSelect(relevancia.valor); }}
                className={`relative cursor-pointer transition-all duration-300 ease-in-out transform ${
                  isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                } ${isSaving ? 'pointer-events-none opacity-50' : ''}`}
                data-tooltip={relevancia.valor}
              >
                <Icone
                  className={`h-5 w-5 transition-colors ${
                    isUtil
                      ? 'text-[#4c4c4c] hover:text-[#CAF10A]'
                      : isLixo
                      ? 'text-[#4c4c4c] hover:text-red-500'
                      : isSuporte
                      ? 'text-[#4c4c4c] hover:text-[#72C5FD]'
                      : ''
                  }`}
                />
              </span>
            );
          })}
        </div>
      ) : (
        <span
          onClick={handleIconClick}
          className={`cursor-pointer ${isSaving ? 'pointer-events-none opacity-50' : ''}`}
        >
          {relevanciaAtual === 'Selecionar' ? (
            <span
              className="text-white text-sm cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => setIsMenuOpen(true)}
            >
              {MENSAGEM_PADRAO}
            </span>
          ) : (
            IconeRelevancia && (
              <IconeRelevancia
                className={`h-5 w-5 transition-colors ${
                  relevanciaAtual === 'Útil'
                    ? 'text-[#CAF10A] hover:text-[#eafb9a]'
                    : relevanciaAtual === 'Lixo'
                    ? 'text-red-700 hover:text-red-500'
                    : 'text-[#72C5FD] hover:text-[#bde4fe]'
                }`}
              />
            )
          )}
        </span>
      )}
    </div>
  );
}

function TemaFloatingCell({ row, updateTema }: { row: Noticia; updateTema: (id: string, tema: string) => void }) {
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const novoTema = e.target.value;
    setTemaSelecionado(novoTema);
    handleSave(novoTema);
  };

  return (
    <div className="relative">
      <select
        value={temaSelecionado}
        onChange={handleChange}
        disabled={isSaving}
        className="p-1 pl-2 pr-8 bg-dark-card border border-white/10 rounded text-sm text-white w-full min-w-[140px] text-left appearance-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30 hover:border-white/20 transition-all"
      >
        <option value="">{MENSAGEM_PADRAO}</option>
        {TEMAS.map((tema) => (
          <option key={tema} value={tema}>
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

function AvaliacaoCell({ row, updateAvaliacao, setNoticias }: { row: Noticia; updateAvaliacao: (id: string, avaliacao: string) => void; setNoticias: React.Dispatch<React.SetStateAction<Noticia[]>> }) {
  const { id, avaliacao, pontos } = row;
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState<string>(
    avaliacao === 'Positiva' ? 'Positiva' : avaliacao === 'Neutra' ? 'Neutra' : avaliacao === 'Negativa' ? 'Negativa' : ''
  );
  const [tempAvaliacao, setTempAvaliacao] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(!avaliacaoSelecionada);
  const { toast } = useToast();

  const handleSave = async (novaAvaliacao: string) => {
    const valorEnviado = novaAvaliacao === '' ? null : novaAvaliacao;
    if (valorEnviado !== avaliacao) {
      setIsSaving(true);
      setTempAvaliacao(novaAvaliacao);
      try {
        const response = await fetch(`${API_BASE_URL}/noticias/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avaliacao: valorEnviado }),
        });
        if (!response.ok) throw new Error('Falha ao salvar a avaliação');
        const pontosBrutos = Math.abs(pontos || 0);
        const novosPontos = valorEnviado === 'Negativa' ? -pontosBrutos : pontosBrutos;
        setNoticias((prevNoticias) =>
          prevNoticias.map((noticia) =>
            noticia.id === id ? { ...noticia, avaliacao: valorEnviado, pontos: novosPontos } : noticia
          )
        );
        setAvaliacaoSelecionada(novaAvaliacao);
        updateAvaliacao(id.toString(), valorEnviado || '');
      } catch (error: any) {
        toast({
          title: 'Erro ao salvar',
          description: 'Não foi possível salvar a avaliação. Tente novamente.',
          variant: 'destructive',
        });
        setTempAvaliacao(null);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSelect = (novaAvaliacao: string) => {
    setAvaliacaoSelecionada(novaAvaliacao);
    handleSave(novaAvaliacao);
    if (novaAvaliacao !== '') {
      setIsMenuOpen(false);
    } else {
      setIsMenuOpen(true);
    }
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir comportamento padrão
    setAvaliacaoSelecionada('');
    handleSave('');
    setIsMenuOpen(true);
  };

  const avaliacaoAtual = isSaving && tempAvaliacao ? tempAvaliacao : avaliacaoSelecionada;
  const avaliacaoObj = AVALIACOES.find((a) => a.valor === avaliacaoAtual);
  const IconeAvaliacao = avaliacaoObj?.icone;

  return (
    <div className="flex justify-center items-center h-full">
      {isMenuOpen ? (
        <div className="flex gap-2">
          {AVALIACOES.map((avaliacao) => {
            const Icone = avaliacao.icone;
            const isPositiva = avaliacao.valor === 'Positiva';
            const isNeutra = avaliacao.valor === 'Neutra';
            const isNegativa = avaliacao.valor === 'Negativa';
            return (
              <span
                key={avaliacao.valor}
                onClick={(e) => { e.preventDefault(); handleSelect(avaliacao.valor); }}
                className={`relative cursor-pointer transition-all duration-300 ease-in-out transform ${
                  isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                } ${isSaving ? 'pointer-events-none opacity-50' : ''}`}
                data-tooltip={avaliacao.valor}
              >
                <Icone
                  className={`h-5 w-5 transition-colors ${
                    isPositiva
                      ? 'text-[#4c4c4c] hover:text-green-600'
                      : isNeutra
                      ? 'text-[#4c4c4c] hover:text-gray-600'
                      : isNegativa
                      ? 'text-[#4c4c4c] hover:text-red-600'
                      : ''
                  }`}
                />
              </span>
            );
          })}
        </div>
      ) : (
        <span
          onClick={handleIconClick}
          className={`cursor-pointer ${isSaving ? 'pointer-events-none opacity-50' : ''}`}
        >
          {avaliacaoAtual === '' ? (
            <span
              className="text-white text-sm cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => setIsMenuOpen(true)}
            >
              {MENSAGEM_PADRAO}
            </span>
          ) : (
            IconeAvaliacao && (
              <IconeAvaliacao
                className={`h-5 w-5 transition-colors ${
                  avaliacaoAtual === 'Positiva'
                    ? 'text-green-600 hover:text-green-400'
                    : avaliacaoAtual === 'Neutra'
                    ? 'text-gray-600 hover:text-gray-400'
                    : 'text-red-600 hover:text-red-400'
                }`}
              />
            )
          )}
        </span>
      )}
    </div>
  );
}

function PontosCell({ row }: { row: Noticia }) {
  const { avaliacao, pontos } = row;
  if (!avaliacao) return <div className="flex items-center justify-center h-full"><span className="text-gray-400">-</span></div>;
  const valorPontos = avaliacao === 'Neutra' ? 0 : avaliacao === 'Negativa' ? -Math.abs(pontos || 0) : pontos || 0;
  return (
    <div className="flex items-center justify-center h-full">
      <span
        className={`font-medium ${
          avaliacao === 'Neutra'
            ? 'text-white'
            : valorPontos < 0
            ? 'text-red-500'
            : 'text-green-500'
        }`}
      >
        {valorPontos}
      </span>
    </div>
  );
}

function EstrategicaCell({ row, setNoticias }: { row: Noticia; setNoticias: React.Dispatch<React.SetStateAction<Noticia[]>> }) {
  const { id, estrategica } = row;
  const [isChecked, setIsChecked] = useState(estrategica || false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleChange = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir comportamento padrão
    const checked = !isChecked;
    setIsChecked(checked);
    setIsSaving(true);
    try {
      const body = { estrategica: checked };
      const response = await fetch(`${API_BASE_URL}/noticias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
      setIsChecked(estrategica || false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <span
        onClick={handleChange}
        className={`cursor-pointer ${isSaving ? 'pointer-events-none opacity-50' : ''}`}
      >
        <Star
          className={`h-5 w-5 transition-colors ${
            isChecked
              ? 'fill-yellow-300 text-yellow-300 hover:text-yellow-200'
              : 'fill-none text-white/20 hover:text-white/40'
          }`}
        />
      </span>
    </div>
  );
}

const getColumns = (
  noticias: Noticia[],
  setNoticias: React.Dispatch<React.SetStateAction<Noticia[]>>,
  updateTema: (id: string, tema: string) => void,
  updateAvaliacao: (id: string, avaliacao: string) => void,
  onRowRemove: (id: string, callback: () => void) => void,
  filterMode: 'Lixo' | 'Suporte' | 'Nenhum'
): ColumnDef[] => [
  {
    id: 'relevancia',
    header: 'Utilidade',
    accessorKey: 'relevancia',
    sortable: true,
    cell: ({ row }) => <RelevanciaCell row={row} setNoticias={setNoticias} onRowRemove={onRowRemove} filterMode={filterMode} />,
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
    cell: ({ row }) => <TemaFloatingCell row={row} updateTema={updateTema} />,
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

interface EstrategicasReturn {
  columns: ColumnDef[];
  isLoading: boolean;
}

const Spreadsheet: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDateEstrategicas, setSelectedDateEstrategicas] = useState<Date | undefined>(undefined);
  const [selectedDateLixeira, setSelectedDateLixeira] = useState<Date | undefined>(undefined);
  const [selectedDateSuporte, setSelectedDateSuporte] = useState<Date | undefined>(undefined);
  const [previousSelectedDate, setPreviousSelectedDate] = useState<Date | undefined>(new Date());
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [strategicDates, setStrategicDates] = useState<Date[]>([]);
  const [trashDates, setTrashDates] = useState<Date[]>([]);
  const [suporteDates, setSuporteDates] = useState<Date[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [filtroAtivo, setFiltroAtivo] = useState<'Nenhum' | 'Lixo' | 'Estrategica' | 'Suporte'>('Nenhum');

  const handleRowRemove = (id: string, callback: () => void) => {
    const rowElement = document.querySelector(`[data-row-id="${id}"]`);
    if (rowElement) {
      rowElement.classList.add('animate-to-trash');
      rowElement.addEventListener('animationend', () => {
        callback();
      }, { once: true });
    } else {
      callback();
    }
  };

  const estrategicas: EstrategicasReturn = Estrategicas({
    noticias,
    setNoticias,
    onRowRemove: handleRowRemove,
    filterMode: filtroAtivo,
  });

  const toggleFiltroLixo = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir comportamento padrão
    const novoFiltro = filtroAtivo === 'Lixo' ? 'Nenhum' : 'Lixo';
    setFiltroAtivo(novoFiltro);
    setCurrentDate(null);
    if (novoFiltro === 'Lixo') {
      setPreviousSelectedDate(selectedDate);
      setSelectedDate(undefined);
    } else {
      setSelectedDate(previousSelectedDate || new Date());
    }
    setSelectedDateEstrategicas(undefined);
    setSelectedDateLixeira(undefined);
    setSelectedDateSuporte(undefined);
  };

  const toggleFiltroEstrategica = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir comportamento padrão
    const novoFiltro = filtroAtivo === 'Estrategica' ? 'Nenhum' : 'Estrategica';
    setFiltroAtivo(novoFiltro);
    setCurrentDate(null);
    if (novoFiltro === 'Estrategica') {
      setPreviousSelectedDate(selectedDate);
      setSelectedDate(undefined);
    } else {
      setSelectedDate(previousSelectedDate || new Date());
    }
    setSelectedDateEstrategicas(undefined);
    setSelectedDateLixeira(undefined);
    setSelectedDateSuporte(undefined);
  };

  const toggleFiltroSuporte = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir comportamento padrão
    const novoFiltro = filtroAtivo === 'Suporte' ? 'Nenhum' : 'Suporte';
    setFiltroAtivo(novoFiltro);
    setCurrentDate(null);
    if (novoFiltro === 'Suporte') {
      setPreviousSelectedDate(selectedDate);
      setSelectedDate(undefined);
    } else {
      setSelectedDate(previousSelectedDate || new Date());
    }
    setSelectedDateEstrategicas(undefined);
    setSelectedDateLixeira(undefined);
    setSelectedDateSuporte(undefined);
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
    const fetchStrategicDates = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/noticias/strategic-dates`);
        if (!response.ok) throw new Error('Erro ao buscar datas estratégicas');
        const dates: string[] = await response.json();
        const parsedDates = dates
          .map((dateStr) => parse(dateStr, 'dd/MM/yyyy', new Date()))
          .filter((date) => !isNaN(date.getTime()));
        setStrategicDates(parsedDates);
      } catch (error: any) {
        console.error('Erro ao buscar datas estratégicas:', error.message);
        setStrategicDates([]);
      }
    };
    fetchStrategicDates();
  }, []);

  useEffect(() => {
    const fetchTrashDates = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/noticias/trash-dates`);
        if (!response.ok) throw new Error('Erro ao buscar datas de notícias na lixeira');
        const dates: string[] = await response.json();
        const parsedDates = dates
          .map((dateStr) => parse(dateStr, 'dd/MM/yyyy', new Date()))
          .filter((date) => !isNaN(date.getTime()));
        setTrashDates(parsedDates);
      } catch (error: any) {
        console.error('Erro ao buscar datas de notícias na lixeira:', error.message);
        setTrashDates([]);
      }
    };
    fetchTrashDates();
  }, []);

  useEffect(() => {
    const fetchSuporteDates = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/noticias/suport-dates`);
        if (!response.ok) throw new Error('Erro ao buscar datas de notícias de suporte');
        const dates: string[] = await response.json();
        const parsedDates = dates
          .map((dateStr) => parse(dateStr, 'dd/MM/yyyy', new Date()))
          .filter((date) => !isNaN(date.getTime()));
        setSuporteDates(parsedDates);
      } catch (error: any) {
        console.error('Erro ao buscar datas de notícias de suporte:', error.message);
        setSuporteDates([]);
      }
    };
    fetchSuporteDates();
  }, []);

  useEffect(() => {
    const fetchNoticias = async () => {
      setIsLoading(true);
      setError(null);

      let url = `${API_BASE_URL}/noticias`;
      if (filtroAtivo === 'Estrategica') {
        if (selectedDateEstrategicas) {
          const dateFormatted = format(selectedDateEstrategicas, 'yyyy-MM-dd');
          url += `?estrategica=true&date=${dateFormatted}`;
        } else {
          url += `?estrategica=true&all=true`;
        }
      } else if (filtroAtivo === 'Lixo') {
        if (selectedDateLixeira) {
          const dateFormatted = format(selectedDateLixeira, 'yyyy-MM-dd');
          url += `?relevancia=Lixo&date=${dateFormatted}`;
        } else {
          url += `?relevancia=Lixo&all=true`;
        }
      } else if (filtroAtivo === 'Suporte') {
        if (selectedDateSuporte) {
          const dateFormatted = format(selectedDateSuporte, 'yyyy-MM-dd');
          url += `?relevancia=Suporte&date=${dateFormatted}`;
        } else {
          url += `?relevancia=Suporte&all=true`;
        }
      } else {
        if (selectedDate) {
          const dateFormatted = format(selectedDate, 'yyyy-MM-dd');
          url += `?date=${dateFormatted}`;
        }
      }

      console.log('Buscando notícias com URL:', url);

      try {
        const response = await fetch(url);
        console.log('Resposta da API:', response.status, response.statusText);
        if (!response.ok) throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
        const responseData = await response.json();
        console.log('Dados recebidos da API:', responseData);

        const { data, meta } = responseData;
        if (Array.isArray(data)) {
          const dataWithIds = data.map((item: any, index: number) => ({
            ...item,
            id: item.id || `noticia-${index}`,
            pontos: item.pontos || 0,
            ciclo: item.ciclo || null,
            categoria: item.categoria || null,
            subcategoria: item.subcategoria || null,
          }));
          console.log('Notícias mapeadas:', dataWithIds);
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
      }
    };

    fetchNoticias();
  }, [selectedDate, selectedDateEstrategicas, selectedDateLixeira, selectedDateSuporte, filtroAtivo, toast]);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    setCurrentDate(null);
  };

  const handleDateChangeEstrategicas = (date: Date | undefined) => {
    setSelectedDateEstrategicas(date);
    setCurrentDate(null);
  };

  const handleDateChangeLixeira = (date: Date | undefined) => {
    setSelectedDateLixeira(date);
    setCurrentDate(null);
  };

  const handleDateChangeSuporte = (date: Date | undefined) => {
    setSelectedDateSuporte(date);
    setCurrentDate(null);
  };

  const handleNext = () => {
    if (hasNext && currentDate) {
      const [day, month, year] = currentDate.split('/');
      const dateFormatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      setCurrentDate(null);
      let url = `${API_BASE_URL}/noticias?before=${dateFormatted}`;
      if (filtroAtivo === 'Estrategica') {
        url += '&estrategica=true';
        if (selectedDateEstrategicas) {
          const selectedDateFormatted = format(selectedDateEstrategicas, 'yyyy-MM-dd');
          url += `&date=${selectedDateFormatted}`;
        }
      } else if (filtroAtivo === 'Lixo') {
        url += '&relevancia=Lixo';
        if (selectedDateLixeira) {
          const selectedDateFormatted = format(selectedDateLixeira, 'yyyy-MM-dd');
          url += `&date=${selectedDateFormatted}`;
        }
      } else if (filtroAtivo === 'Suporte') {
        url += '&relevancia=Suporte';
        if (selectedDateSuporte) {
          const selectedDateFormatted = format(selectedDateSuporte, 'yyyy-MM-dd');
          url += `&date=${selectedDateFormatted}`;
        }
      } else {
        if (selectedDate) {
          const selectedDateFormatted = format(selectedDate, 'yyyy-MM-dd');
          url += `&date=${selectedDateFormatted}`;
        }
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
            ciclo: item.ciclo || null,
            categoria: item.categoria || null,
            subcategoria: item.subcategoria || null,
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
      const [day, month, year] = currentDate.split('/');
      const dateFormatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      setCurrentDate(null);
      let url = `${API_BASE_URL}/noticias?after=${dateFormatted}`;
      if (filtroAtivo === 'Estrategica') {
        url += '&estrategica=true';
        if (selectedDateEstrategicas) {
          const selectedDateFormatted = format(selectedDateEstrategicas, 'yyyy-MM-dd');
          url += `&date=${selectedDateFormatted}`;
        }
      } else if (filtroAtivo === 'Lixo') {
        url += '&relevancia=Lixo';
        if (selectedDateLixeira) {
          const selectedDateFormatted = format(selectedDateLixeira, 'yyyy-MM-dd');
          url += `&date=${selectedDateFormatted}`;
        }
      } else if (filtroAtivo === 'Suporte') {
        url += '&relevancia=Suporte';
        if (selectedDateSuporte) {
          const selectedDateFormatted = format(selectedDateSuporte, 'yyyy-MM-dd');
          url += `&date=${selectedDateFormatted}`;
        }
      } else {
        if (selectedDate) {
          const selectedDateFormatted = format(selectedDate, 'yyyy-MM-dd');
          url += `&date=${selectedDateFormatted}`;
        }
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
            ciclo: item.ciclo || null,
            categoria: item.categoria || null,
            subcategoria: item.subcategoria || null,
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

  const columns = filtroAtivo === 'Estrategica'
    ? estrategicas.columns
    : getColumns(noticias, setNoticias, updateTema, updateAvaliacao, handleRowRemove, filtroAtivo);

  return (
    <>
      <style>
        {`
          .animate-to-trash {
            animation: slideToTrash 0.5s ease-in-out forwards;
          }

          @keyframes slideToTrash {
            0% { transform: translateX(0); opacity: 1; }
            100% { transform: translateX(-100px); opacity: 0; }
          }
        `}
      </style>
      <div className="min-h-screen bg-dark-bg text-white">
        <Navbar />
        <main className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Planilha de Matérias</h1>
              <p className="text-gray-400">Gerenciamento e análise de notícias</p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              {filtroAtivo === 'Estrategica' ? (
                <span
                  onClick={toggleFiltroEstrategica}
                  className="cursor-pointer text-yellow-300 hover:text-yellow-200"
                >
                  <CircleArrowLeft className="h-6 w-6" />
                </span>
              ) : filtroAtivo !== 'Lixo' && filtroAtivo !== 'Suporte' ? (
                <span
                  onClick={toggleFiltroEstrategica}
                  className="cursor-pointer text-yellow-300 hover:text-yellow-200"
                >
                  <Star className="h-6 w-6" />
                </span>
              ) : null}
              {filtroAtivo === 'Lixo' ? (
                <span
                  onClick={toggleFiltroLixo}
                  className="cursor-pointer text-red-500 hover:text-red-400"
                >
                  <CircleArrowLeft className="h-6 w-6" />
                </span>
              ) : filtroAtivo !== 'Estrategica' && filtroAtivo !== 'Suporte' ? (
                <span
                  onClick={toggleFiltroLixo}
                  className="cursor-pointer text-red-500 hover:text-red-400"
                >
                  <Trash2 className="h-6 w-6" />
                </span>
              ) : null}
              {filtroAtivo === 'Suporte' ? (
                <span
                  onClick={toggleFiltroSuporte}
                  className="cursor-pointer text-blue-400 hover:text-blue-300"
                >
                  <CircleArrowLeft className="h-6 w-6" />
                </span>
              ) : filtroAtivo !== 'Estrategica' && filtroAtivo !== 'Lixo' ? (
                <span
                  onClick={toggleFiltroSuporte}
                  className="cursor-pointer text-blue-400 hover:text-blue-300"
                >
                  <Lightbulb className="h-6 w-6" />
                </span>
              ) : null}
              {filtroAtivo === 'Estrategica' ? (
                <DatePickerEstrategicas onChange={handleDateChangeEstrategicas} strategicDates={strategicDates} />
              ) : filtroAtivo === 'Lixo' ? (
                <DatePickerLixeira onChange={handleDateChangeLixeira} trashDates={trashDates} />
              ) : filtroAtivo === 'Suporte' ? (
                <DatePickerSuporte onChange={handleDateChangeSuporte} suporteDates={suporteDates} />
              ) : (
                <DatePicker onChange={handleDateChange} />
              )}
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
                onRowRemove={handleRowRemove}
                filterMode={filtroAtivo}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Spreadsheet;