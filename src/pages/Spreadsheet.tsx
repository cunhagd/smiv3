import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import DataTable from '@/components/DataTable';
import { Filter, Download, ExternalLink, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import DateRangePicker from '@/components/DateRangePicker';

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

const columns = [
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
    cell: (info) => {
      const { row } = info;
      return (
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
    },
  },
  {
    id: 'tema',
    header: 'Tema',
    accessorKey: 'tema',
    sortable: true,
    cell: (info) => {
      const { row, updateTema } = info;
      console.log('Dados da linha para tema:', row);
      const [temaSelecionado, setTemaSelecionado] = useState(row.tema || '');
      const [isSaving, setIsSaving] = useState(false);

      const handleSave = async (novoTema) => {
        if (novoTema && novoTema !== row.tema) {
          setIsSaving(true);
          try {
            const response = await fetch(
              `https://smi-api-production-fae2.up.railway.app/noticias/${row.id}`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tema: novoTema }),
              }
            );
            if (!response.ok) {
              throw new Error('Falha ao salvar o tema');
            }
            console.log('Tema salvo com sucesso:', novoTema);
            updateTema(row.id, novoTema);
          } catch (error) {
            console.error('Erro ao salvar o tema:', error.message);
          } finally {
            setIsSaving(false);
          }
        }
      };

      return (
        <select
          value={temaSelecionado}
          onChange={(e) => {
            const novoTema = e.target.value;
            setTemaSelecionado(novoTema);
            handleSave(novoTema);
          }}
          disabled={isSaving}
          className="p-1 bg-dark-card border border-white/10 rounded text-sm text-white w-32"
        >
          <option value="">Selecione um tema...</option>
          {TEMAS.map((tema) => (
            <option key={tema} value={tema}>
              {tema}
            </option>
          ))}
        </select>
      );
    },
  },
  {
    id: 'avaliacao',
    header: 'Avaliação',
    accessorKey: 'avaliacao',
    sortable: true,
    cell: (info) => {
      const { row, updateAvaliacao } = info;
      const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState(row.avaliacao || '');
      const [isSaving, setIsSaving] = useState(false);

      const handleSave = async (novaAvaliacao) => {
        if (novaAvaliacao && novaAvaliacao !== row.avaliacao) {
          setIsSaving(true);
          try {
            const response = await fetch(
              `https://smi-api-production-fae2.up.railway.app/noticias/${row.id}`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ avaliacao: novaAvaliacao }),
              }
            );
            if (!response.ok) {
              throw new Error('Falha ao salvar a avaliação');
            }
            console.log('Avaliação salva com sucesso:', novaAvaliacao);
            updateAvaliacao(row.id, novaAvaliacao);
          } catch (error) {
            console.error('Erro ao salvar a avaliação:', error.message);
          } finally {
            setIsSaving(false);
          }
        }
      };

      const avaliacaoObj = AVALIACOES.find(a => a.valor === avaliacaoSelecionada);
      const IconeAvaliacao = avaliacaoObj?.icone;
      
      return (
        <div className="relative">
          <select
            value={avaliacaoSelecionada}
            onChange={(e) => {
              const novaAvaliacao = e.target.value;
              setAvaliacaoSelecionada(novaAvaliacao);
              handleSave(novaAvaliacao);
            }}
            disabled={isSaving}
            className={`p-1 px-8 border rounded text-sm w-32 ${
              avaliacaoSelecionada === 'Positiva' 
                ? 'bg-[#F2FCE2] text-green-800 border-green-300' 
                : avaliacaoSelecionada === 'Negativa' 
                ? 'bg-[#FFDEE2] text-red-800 border-red-300' 
                : avaliacaoSelecionada === 'Neutra' 
                ? 'bg-[#F1F0FB] text-gray-800 border-gray-300' 
                : 'bg-dark-card border-white/10 text-white'
            }`}
          >
            <option value="">Selecione...</option>
            {AVALIACOES.map((avaliacao) => (
              <option key={avaliacao.valor} value={avaliacao.valor}>
                {avaliacao.valor}
              </option>
            ))}
          </select>
          {IconeAvaliacao && (
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
              <IconeAvaliacao className={`h-4 w-4 ${
                avaliacaoSelecionada === 'Positiva' 
                  ? 'text-green-600' 
                  : avaliacaoSelecionada === 'Negativa' 
                  ? 'text-red-600' 
                  : 'text-gray-600'
              }`} />
            </span>
          )}
        </div>
      );
    },
  },
];

const Spreadsheet = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date('2025-03-01'),
    to: new Date('2025-03-15'),
  });
  const [noticias, setNoticias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateTema = (id, novoTema) => {
    setNoticias(prevNoticias =>
      prevNoticias.map(noticia =>
        noticia.id === id ? { ...noticia, tema: novoTema } : noticia
      )
    );
  };

  const updateAvaliacao = (id, novaAvaliacao) => {
    setNoticias(prevNoticias =>
      prevNoticias.map(noticia =>
        noticia.id === id ? { ...noticia, avaliacao: novaAvaliacao } : noticia
      )
    );
  };

  useEffect(() => {
    console.log('useEffect iniciado');
    setIsLoading(true);
    setError(null);
    const from = dateRange.from.toISOString().split('T')[0];
    const to = dateRange.to.toISOString().split('T')[0];
    console.log('Chamando API com from:', from, 'e to:', to);
    fetch(`https://smi-api-production-fae2.up.railway.app/noticias?from=${from}&to=${to}`)
      .then(response => {
        console.log('Resposta bruta da API:', response.status, response.statusText);
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Dados das notícias recebidos da API:', data);
        if (Array.isArray(data)) {
          // Garantir que todos os registros tenham um ID único para a seleção
          const dataWithIds = data.map((item, index) => ({
            ...item,
            id: item.id || `noticia-${index}`
          }));
          setNoticias(dataWithIds);
        } else {
          console.warn('A resposta da API não é um array:', data);
          setNoticias([]);
        }
      })
      .catch(error => {
        console.error('Erro ao buscar notícias:', error.message);
        setError(error.message);
        setNoticias([]);
      })
      .finally(() => {
        console.log('useEffect finalizado');
        setIsLoading(false);
      });
  }, [dateRange]);

  const handleDateRangeChange = (range) => {
    console.log('DateRange alterado:', range);
    if (range.from && range.to) {
      setDateRange({ from: range.from, to: range.to });
    }
  };

  console.log('Renderizando Spreadsheet, noticias:', noticias);

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
            <DateRangePicker onChange={handleDateRangeChange} />
            <button className="px-3 py-2 rounded-lg border border-white/10 bg-dark-card flex items-center gap-2 hover:bg-dark-card-hover">
              <Download className="h-4 w-4" />
              <span className="text-sm">Exportar</span>
            </button>
          </div>
        </div>
        <div className="dashboard-card">
          {isLoading ? (
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
            <DataTable data={noticias} columns={columns} updateTema={updateTema} updateAvaliacao={updateAvaliacao} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Spreadsheet;
