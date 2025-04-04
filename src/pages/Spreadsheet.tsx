
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import DataTable from '@/components/DataTable';
import { Filter, Download, ExternalLink, ThumbsUp, ThumbsDown, Minus, ChevronDown } from 'lucide-react';
import DateRangePicker from '@/components/DateRangePicker';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";

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

// Adicionar opções de relevância
const RELEVANCIA = [
  { valor: 'Relevante', cor: '#F2FCE2' },
  { valor: 'Irrelevante', cor: '#FFDEE2' },
];

// Mensagem padrão para os dropdowns
const MENSAGEM_PADRAO = "Selecionar";

// Definimos os columns fora do componente para evitar rerenders desnecessários
const getColumns = (noticias, setNoticias) => [
  {
    id: 'relevancia',
    header: 'Relevância',
    accessorKey: 'relevancia',
    sortable: true,
    cell: (info) => {
      const { row } = info;
      // Verificar se row existe para evitar erros
      if (!row) {
        return null;
      }
      
      // Usamos row diretamente
      const data = row;
      const id = data.id;
      
      const [relevSelecionada, setRelevSelecionada] = useState(data.relevancia || '');
      const [isSaving, setIsSaving] = useState(false);

      const handleSave = async (novaRelevancia) => {
        const valorEnviado = novaRelevancia === "" ? null : novaRelevancia;
      
        if (valorEnviado !== data.relevancia) {
          setIsSaving(true);
          try {
            const response = await fetch(
              `https://smi-api-production-fae2.up.railway.app/noticias/${id}`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ relevancia: valorEnviado }),
              }
            );
            if (!response.ok) {
              throw new Error('Falha ao salvar relevância');
            }
            
            // Atualizamos a lista de notícias para refletir a mudança imediatamente
            setNoticias(prevNoticias => 
              prevNoticias.map(noticia => 
                noticia.id === id 
                  ? { ...noticia, relevancia: valorEnviado } 
                  : noticia
              )
            );
            
            console.log('Relevância salva com sucesso:', valorEnviado);
          } catch (error) {
            console.error('Erro ao salvar relevância:', error.message);
          } finally {
            setIsSaving(false);
          }
        }
      };

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
            className="p-1 pl-2 pr-8 bg-dark-card border border-white/10 rounded text-sm text-white w-full min-w-[140px] text-left appearance-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30 hover:border-white/20 transition-all"
          >
            <option value="" className="text-left">{MENSAGEM_PADRAO}</option>
            {RELEVANCIA.map((rel) => (
              <option key={rel.valor} value={rel.valor} className="text-left">
                {rel.valor}
              </option>
            ))}
          </select>
          
          {relevSelecionada && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                relevSelecionada === 'Relevante' 
                  ? 'bg-green-500/80 text-black' 
                  : relevSelecionada === 'Irrelevante' 
                  ? 'bg-red-500/80 text-white'
                  : ''
              }`}>
                {relevSelecionada}
              </span>
            </div>
          )}
          
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/60">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      );
    },
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
    cell: (info) => {
      const { row } = info;
      // Verificar se row existe para evitar erros
      if (!row) {
        return null;
      }
      
      // Usamos row.original se existir, senão usamos row diretamente
      const data = row.original || row;
      
      return (
        <a
          href={data.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
        >
          {data.titulo}
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
      // Verificar se row existe para evitar erros
      if (!row) {
        return null;
      }
      
      // Usamos row.original se existir, senão usamos row diretamente
      const data = row.original || row;
      const id = data.id;
      
      const [temaSelecionado, setTemaSelecionado] = useState(data.tema || '');
      const [isSaving, setIsSaving] = useState(false);

      const handleSave = async (novoTema) => {
        const valorEnviado = novoTema === "" ? null : novoTema; // Converter "" para null
      
        if (valorEnviado !== data.tema) {
          setIsSaving(true);
          try {
            const response = await fetch(
              `https://smi-api-production-fae2.up.railway.app/noticias/${id}`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tema: valorEnviado }), // Enviar null corretamente
              }
            );
            if (!response.ok) {
              throw new Error('Falha ao salvar');
            }
            console.log('Salvo com sucesso:', valorEnviado);
            updateTema(id, valorEnviado);
          } catch (error) {
            console.error('Erro ao salvar:', error.message);
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
    },
  },
  {
    id: 'avaliacao',
    header: 'Avaliação',
    accessorKey: 'avaliacao',
    sortable: true,
    cell: (info) => {
      const { row, updateAvaliacao } = info;
      // Verificar se row existe para evitar erros
      if (!row) {
        return null;
      }
      
      // Usamos row.original se existir, senão usamos row diretamente
      const data = row.original || row;
      const id = data.id;
      const { toast } = useToast();
      
      const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState(data.avaliacao || '');
      const [isSaving, setIsSaving] = useState(false);

      const handleSave = async (novaAvaliacao) => {
        const valorEnviado = novaAvaliacao === "" ? null : novaAvaliacao; // Converter "" para null
      
        if (valorEnviado !== data.avaliacao) {
          setIsSaving(true);
          try {
            const response = await fetch(
              `https://smi-api-production-fae2.up.railway.app/noticias/${id}`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ avaliacao: valorEnviado }), // Enviar null corretamente
              }
            );
            if (!response.ok) {
              throw new Error('Falha ao salvar a avaliação');
            }
      
            console.log('Avaliação salva com sucesso:', valorEnviado);
      
            // Atualizar os pontos somente se a avaliação não for nula
            let novosPontos = 0;
            if (valorEnviado) {
              const pontosBrutos = Math.abs(data.pontos || 0);
              novosPontos = valorEnviado === 'Negativa' ? -pontosBrutos : pontosBrutos;
            }
      
            // Atualizamos a avaliação e os pontos da notícia no estado global
            updateAvaliacao(id, valorEnviado, novosPontos);
          } catch (error) {
            console.error('Erro ao salvar a avaliação:', error.message);
            toast({
              title: "Erro ao salvar",
              description: "Não foi possível salvar a avaliação. Tente novamente.",
              variant: "destructive",
            });
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
              
              // Atualizamos localmente os pontos da notícia para mostrar em tempo real
              const pontosBrutos = Math.abs(data.pontos || 0);
              const novosPontos = novaAvaliacao === 'Negativa' ? -pontosBrutos : pontosBrutos;
              
              // Atualizamos a lista de notícias para refletir a mudança imediatamente
              setNoticias(prevNoticias => 
                prevNoticias.map(noticia => 
                  noticia.id === id 
                    ? { 
                        ...noticia, 
                        avaliacao: novaAvaliacao,
                        pontos: novosPontos
                      } 
                    : noticia
                )
              );
              
              // Enviamos para o servidor em segundo plano
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
              <IconeAvaliacao className={`h-4 w-4 ${
                avaliacaoSelecionada === 'Positiva' 
                  ? 'text-green-600' 
                  : avaliacaoSelecionada === 'Negativa' 
                  ? 'text-red-600' 
                  : 'text-gray-600'
              }`} />
            </div>
          )}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/60">
            <ChevronDown className={`h-4 w-4 ${
              avaliacaoSelecionada ? 'text-gray-600' : 'text-white/60'
            }`} />
          </div>
        </div>
      );
    },
  },
  {
    id: 'pontos',
    header: 'Pontos',
    accessorKey: 'pontos',
    sortable: true,
    cell: (info) => {
      const { row } = info;
      // Verificar se row existe para evitar erros
      if (!row) {
        return null;
      }
      
      // Usamos row.original se existir, senão usamos row diretamente
      const data = row.original || row;
      
      // Verificamos se uma avaliação foi selecionada
      const avaliacao = data.avaliacao || '';
      
      // Se não houver avaliação selecionada, não exibimos pontos
      if (!avaliacao) {
        return <span className="text-gray-400">-</span>;
      }
      
      // Verificamos a avaliação da notícia para determinar se os pontos são positivos ou negativos
      const pontos = data.pontos || 0;
      
      // Se a avaliação for negativa, mostramos o valor como negativo
      const valorPontos = avaliacao === 'Negativa' ? -Math.abs(pontos) : pontos;
      
      return (
        <span className={`font-medium ${
          valorPontos < 0 
            ? 'text-red-500' 
            : valorPontos > 0 
            ? 'text-green-500' 
            : 'text-gray-400'
        }`}>
          {valorPontos}
        </span>
      );
    },
  },
];

const Spreadsheet = () => {
  const today = new Date(); 
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [dateRange, setDateRange] = useState({
    from: thirtyDaysAgo, 
    to: today, 
  });
  const [noticias, setNoticias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Criamos as colunas dentro do componente para ter acesso ao setNoticias
  const columns = getColumns(noticias, setNoticias);

  const updateTema = (id, novoTema) => {
    setNoticias(prevNoticias =>
      prevNoticias.map(noticia =>
        noticia.id === id ? { ...noticia, tema: novoTema } : noticia
      )
    );
  };

  const updateAvaliacao = (id, novaAvaliacao) => {
    setNoticias(prevNoticias =>
      prevNoticias.map(noticia => {
        if (noticia.id === id) {
          // Calculamos o valor correto dos pontos baseado na nova avaliação
          const pontosBrutos = Math.abs(noticia.pontos || 0);
          const novosPontos = novaAvaliacao === 'Negativa' ? -pontosBrutos : pontosBrutos;
          
          return { 
            ...noticia, 
            avaliacao: novaAvaliacao,
            pontos: novosPontos 
          };
        }
        return noticia;
      })
    );
  };

  // Função para buscar os pontos das notícias
  const buscarPontosDasNoticias = async (noticias) => {
    try {
      const response = await fetch('https://smi-api-production-fae2.up.railway.app/noticias/pontos');
      if (!response.ok) {
        throw new Error('Falha ao buscar pontos das notícias');
      }
      const pontos = await response.json();
      
      // Adicionamos os pontos às notícias correspondentes
      const noticiasComPontos = noticias.map(noticia => {
        const noticiaPontos = pontos.find(p => p.id === noticia.id);
        let pontosNoticia = noticiaPontos ? noticiaPontos.pontos : 0;
        
        // Aplica a regra de pontos negativos se a avaliação for negativa
        if (noticia.avaliacao === 'Negativa') {
          pontosNoticia = -Math.abs(pontosNoticia);
        }
        
        return {
          ...noticia,
          pontos: pontosNoticia
        };
      });
      
      return noticiasComPontos;
    } catch (error) {
      console.error('Erro ao buscar pontos das notícias:', error.message);
      toast({
        title: "Erro ao buscar pontos",
        description: "Não foi possível carregar os pontos das notícias.",
        variant: "destructive",
      });
      return noticias; // Retorna as notícias sem pontos em caso de erro
    }
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
      .then(async data => {
        console.log('Dados das notícias recebidos da API:', data);
        if (Array.isArray(data)) {
          // Garantir que todos os registros tenham um ID único para a seleção
          const dataWithIds = data.map((item, index) => ({
            ...item,
            id: item.id || `noticia-${index}`
          }));
          
          // Buscar os pontos para cada notícia
          const noticiasComPontos = await buscarPontosDasNoticias(dataWithIds);
          setNoticias(noticiasComPontos);
        } else {
          console.warn('A resposta da API não é um array:', data);
          setNoticias([]);
        }
      })
      .catch(error => {
        console.error('Erro ao buscar notícias:', error.message);
        setError(error.message);
        toast({
          title: "Erro ao buscar notícias",
          description: error.message,
          variant: "destructive",
        });
        setNoticias([]);
      })
      .finally(() => {
        console.log('useEffect finalizado');
        setIsLoading(false);
      });
  }, [dateRange, toast]);

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
