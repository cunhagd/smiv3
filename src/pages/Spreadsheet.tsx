import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import DataTable from '@/components/DataTable';
import { ExternalLink, ThumbsUp, ThumbsDown, Minus, ChevronDown, CircleArrowLeft, CircleCheckBig, CircleX, Star } from 'lucide-react';
import DateRangePicker from '@/components/DateRangePicker';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

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
  { valor: 'Relevante', cor: '#F2FCE2', icone: CircleCheckBig },
  { valor: 'Irrelevante', cor: '#FFDEE2', icone: CircleX },
];

const ESTRATEGICA = [
  'Selecionar',
  'Sim',
  'Não',
];

const CATEGORIA = [
  'Selecionar',
  'Educação',
  'Saúde',
  'Infraestrutura',
  'Social',
];

const SUB_CATEGORIA = [
  'Selecionar',
  'Campanha',
  'Investimento',
  'Obras',
  'Projeto',
  'Outro',
];

const MENSAGEM_PADRAO = "Selecionar";

function RelevanciaCell({ row, setNoticias }) {
  const data = row || {};
  const id = data.id;

  const mapRelevanciaToString = (relevancia) => {
    if (relevancia === true) return 'Relevante';
    if (relevancia === false) return 'Irrelevante';
    return '';
  };

  const mapStringToRelevancia = (valor) => {
    if (valor === 'Relevante') return true;
    if (valor === 'Irrelevante') return false;
    return null;
  };

  const [relevSelecionada, setRelevSelecionada] = useState(mapRelevanciaToString(data.relevancia));
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async (novaRelevancia) => {
    const valorEnviado = mapStringToRelevancia(novaRelevancia);

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
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar a relevância. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const relevanciaObj = RELEVANCIA.find(r => r.valor === relevSelecionada);
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
          relevSelecionada === 'Relevante' 
            ? 'bg-[#F2FCE2] text-green-800 border-green-300 focus:border-green-400 focus:ring-green-400/30 hover:border-green-400' 
            : relevSelecionada === 'Irrelevante' 
            ? 'bg-[#FFDEE2] text-red-800 border-red-300 focus:border-red-400 focus:ring-red-400/30 hover:border-red-400' 
            : 'bg-dark-card border-white/10 text-white focus:border-blue-400/50 focus:ring-blue-400/30 hover:border-white/20'
        }`}
      >
        <option value="" className="text-left">{MENSAGEM_PADRAO}</option>
        {RELEVANCIA.map((relevancia) => (
          <option key={relevancia.valor} value={relevancia.valor} className="text-left">
            {relevancia.valor}
          </option>
        ))}
      </select>
      {IconeRelevancia && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2">
          <IconeRelevancia className={`h-4 w-4 ${
            relevSelecionada === 'Relevante' 
              ? 'text-green-600' 
              : relevSelecionada === 'Irrelevante' 
              ? 'text-red-600' 
              : 'text-gray-600'
          }`} />
        </div>
      )}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/60">
        <ChevronDown className={`h-4 w-4 ${
          relevSelecionada ? 'text-gray-600' : 'text-white/60'
        }`} />
      </div>
    </div>
  );
}

function TemaCell({ row, updateTema }) {
  const data = row || {};
  const id = data.id;
  
  const [temaSelecionado, setTemaSelecionado] = useState(data.tema || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (novoTema) => {
    const valorEnviado = novoTema === "" ? null : novoTema;
  
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
            body: JSON.stringify({ tema: valorEnviado }),
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
}

function AvaliacaoCell({ row, updateAvaliacao, setNoticias }) {
  const data = row || {};
  const id = data.id;
  
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState(data.avaliacao || '');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async (novaAvaliacao) => {
    const valorEnviado = novaAvaliacao === "" ? null : novaAvaliacao;
  
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
            body: JSON.stringify({ avaliacao: valorEnviado }),
          }
        );
        if (!response.ok) {
          throw new Error('Falha ao salvar a avaliação');
        }
  
        console.log('Avaliação salva com sucesso:', valorEnviado);
  
        let novosPontos = 0;
        if (valorEnviado) {
          const pontosBrutos = Math.abs(data.pontos || 0);
          novosPontos = valorEnviado === 'Negativa' ? -pontosBrutos : pontosBrutos;
        }
  
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
          
          const pontosBrutos = Math.abs(data.pontos || 0);
          const novosPontos = novaAvaliacao === 'Negativa' ? -pontosBrutos : pontosBrutos;
          
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
}

function SubCategoriaCell({ row, setNoticias }) {
  const data = row || {};
  const id = data.id;
  const [subCategoriaSelecionada, setSubCategoriaSelecionada] = useState(data.subcategoria || 'Selecionar');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async (novaSubCategoria) => {
    const valorEnviado = novaSubCategoria === 'Selecionar' ? null : novaSubCategoria;
    if (valorEnviado !== data.subcategoria) {
      setIsSaving(true);
      try {
        const response = await fetch(
          `https://smi-api-production-fae2.up.railway.app/noticias/${id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subcategoria: valorEnviado }),
          }
        );
        if (!response.ok) {
          throw new Error('Falha ao salvar subcategoria');
        }
        setNoticias((prevNoticias) =>
          prevNoticias.map((noticia) =>
            noticia.id === id ? { ...noticia, subcategoria: valorEnviado } : noticia
          )
        );
        console.log('Subcategoria salva com sucesso:', valorEnviado);
      } catch (error) {
        console.error('Erro ao salvar subcategoria:', error.message);
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar a subcategoria. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="relative">
      <select
        value={subCategoriaSelecionada}
        onChange={(e) => {
          const novaSubCategoria = e.target.value;
          setSubCategoriaSelecionada(novaSubCategoria);
          handleSave(novaSubCategoria);
        }}
        disabled={isSaving}
        className="p-1 pl-2 pr-8 bg-dark-card border border-white/10 rounded text-sm text-white w-full min-w-[140px] text-left appearance-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30 hover:border-white/20 transition-all"
      >
        <option value="Selecionar" className="text-left">{MENSAGEM_PADRAO}</option>
        {SUB_CATEGORIA.filter(cat => cat !== 'Selecionar').map((subcategoria) => (
          <option key={subcategoria} value={subcategoria} className="text-left">
            {subcategoria}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/60">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
}

function TituloCell({ row }) {
  const data = row || {};
  
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
}

function PontosCell({ row }) {
  const data = row || {};
  
  const avaliacao = data.avaliacao || '';
  
  if (!avaliacao) {
    return <span className="text-gray-400">-</span>;
  }
  
  const pontos = data.pontos || 0;
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
}

function EstrategicaCell({ row, setNoticias }) {
  const data = row || {};
  const id = data.id;

  // Mapeia o valor booleano do banco para o texto do dropdown
  const mapEstrategicaToString = (estrategica) => {
    if (estrategica === true) return 'Sim';
    if (estrategica === false) return 'Não';
    return 'Selecionar';
  };

  // Mapeia o texto do dropdown para o valor booleano ou null
  const mapStringToEstrategica = (valor) => {
    if (valor === 'Sim') return true;
    if (valor === 'Não') return false;
    return null;
  };

  const [estrategicaSelecionada, setEstrategicaSelecionada] = useState(mapEstrategicaToString(data.estrategica));
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async (novaEstrategica) => {
    const valorEnviado = mapStringToEstrategica(novaEstrategica);
    if (valorEnviado !== data.estrategica) {
      setIsSaving(true);
      try {
        const response = await fetch(
          `https://smi-api-production-fae2.up.railway.app/noticias/${id}`, // Use http://localhost:3000 para testes locais
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estrategica: valorEnviado }),
          }
        );
        if (!response.ok) {
          throw new Error('Falha ao salvar estratégica');
        }
        setNoticias((prevNoticias) =>
          prevNoticias.map((noticia) =>
            noticia.id === id ? { ...noticia, estrategica: valorEnviado } : noticia
          )
        );
        console.log('Estratégica salva com sucesso:', valorEnviado);
      } catch (error) {
        console.error('Erro ao salvar estratégica:', error.message);
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar a estratégica. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="relative">
      <select
        value={estrategicaSelecionada}
        onChange={(e) => {
          const novaEstrategica = e.target.value;
          setEstrategicaSelecionada(novaEstrategica);
          handleSave(novaEstrategica);
        }}
        disabled={isSaving}
        className="p-1 pl-2 pr-8 bg-dark-card border border-white/10 rounded text-sm text-white w-full min-w-[140px] text-left appearance-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30 hover:border-white/20 transition-all"
      >
        {ESTRATEGICA.map((estrategica) => (
          <option key={estrategica} value={estrategica} className="text-left">
            {estrategica}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/60">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
}

function CategoriaCell({ row, setNoticias }) {
  const data = row || {};
  const id = data.id;
  const dataNoticia = data.data; // Data da notícia no formato DD/MM/YYYY
  const categoriaSemana = data.categoria_semana || null; // Categoria retornada pela semana_estrategica
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(data.categoria || 'Selecionar');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Define as opções do dropdown: "Selecionar" e a categoria da semana_estrategica (se disponível)
  const opcoesCategoria = categoriaSemana ? ['Selecionar', categoriaSemana] : ['Selecionar'];

  const handleSave = async (novaCategoria) => {
    const valorEnviado = novaCategoria === 'Selecionar' ? null : novaCategoria;
    if (valorEnviado !== data.categoria) {
      setIsSaving(true);
      try {
        const response = await fetch(
          `https://smi-api-production-fae2.up.railway.app/noticias/${id}`, // Corrigido para atualizar a notícia
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoria: valorEnviado }),
          }
        );
        if (!response.ok) {
          throw new Error('Falha ao salvar categoria');
        }
        setNoticias((prevNoticias) =>
          prevNoticias.map((noticia) =>
            noticia.id === id ? { ...noticia, categoria: valorEnviado } : noticia
          )
        );
        console.log('Categoria salva com sucesso:', valorEnviado);
      } catch (error) {
        console.error('Erro ao salvar categoria:', error.message);
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar a categoria. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="relative">
      <select
        value={categoriaSelecionada}
        onChange={(e) => {
          const novaCategoria = e.target.value;
          setCategoriaSelecionada(novaCategoria);
          handleSave(novaCategoria);
        }}
        disabled={isSaving}
        className="p-1 pl-2 pr-8 bg-dark-card border border-white/10 rounded text-sm text-white w-full min-w-[140px] text-left appearance-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30 hover:border-white/20 transition-all"
      >
        {opcoesCategoria.map((categoria) => (
          <option key={categoria} value={categoria} className="text-left">
            {categoria}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/60">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
}

const getColumns = (noticias, setNoticias, mostrarEstrategicas = false) => {
  if (mostrarEstrategicas) {
    return [
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
        cell: (info) => <TituloCell row={info.row} />,
      },
      {
        id: 'estrategica',
        header: 'Estratégica',
        accessorKey: 'estrategica',
        sortable: true,
        cell: (info) => <EstrategicaCell row={info.row} setNoticias={setNoticias} />,
      },
      {
        id: 'categoria',
        header: 'Categoria',
        accessorKey: 'categoria',
        sortable: true,
        cell: (info) => <CategoriaCell row={info.row} setNoticias={setNoticias} />,
      },
      {
        id: 'subcategoria',
        header: 'Sub Categoria',
        accessorKey: 'subcategoria',
        sortable: true,
        cell: (info) => <SubCategoriaCell row={info.row} setNoticias={setNoticias} />,
      },
    ];
  }
  
  return [
    {
      id: 'relevancia',
      header: 'Relevância',
      accessorKey: 'relevancia',
      sortable: true,
      cell: (info) => <RelevanciaCell row={info.row} setNoticias={setNoticias} />,
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
      cell: (info) => <TituloCell row={info.row} />,
    },
    {
      id: 'tema',
      header: 'Tema',
      accessorKey: 'tema',
      sortable: true,
      cell: (info) => <TemaCell row={info.row} updateTema={info.updateTema} />,
    },
    {
      id: 'avaliacao',
      header: 'Avaliação',
      accessorKey: 'avaliacao',
      sortable: true,
      cell: (info) => <AvaliacaoCell row={info.row} updateAvaliacao={info.updateAvaliacao} setNoticias={setNoticias} />,
    },
    {
      id: 'pontos',
      header: 'Pontos',
      accessorKey: 'pontos',
      sortable: true,
      cell: (info) => <PontosCell row={info.row} />,
    },
    {
      id: 'estrategica',
      header: 'Estratégica',
      accessorKey: 'estrategica',
      sortable: true,
      cell: (info) => <EstrategicaCell row={info.row} setNoticias={setNoticias} />,
    },
  ];
};

const Spreadsheet = () => {
  const today = new Date(); 
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [dateRange, setDateRange] = useState({
    from: thirtyDaysAgo, 
    to: today, 
  });
  const [noticias, setNoticias] = useState([]);
  const [total, setTotal] = useState(0);
  const [cursor, setCursor] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [limit] = useState(80);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const [filtroRelevancia, setFiltroRelevancia] = useState('Relevante');
  const [mostrarEstrategicas, setMostrarEstrategicas] = useState(false);
  
  const toggleFiltroRelevancia = () => {
    if (filtroRelevancia === 'Irrelevante') {
      setFiltroRelevancia('Relevante');
      setCursor(null); // Resetar o cursor ao mudar o filtro
      setMostrarEstrategicas(false); // Fechar estratégicas ao mostrar outras views
    } else {
      setFiltroRelevancia('Irrelevante');
      setCursor(null); // Resetar o cursor ao mudar o filtro
      setMostrarEstrategicas(false); // Fechar estratégicas ao mostrar outras views
    }
  };

  const toggleMostrarEstrategicas = () => {
    if (mostrarEstrategicas) {
      setMostrarEstrategicas(false);
      setCursor(null); // Resetar o cursor ao mudar o filtro
      setFiltroRelevancia('Relevante'); // Voltar para view relevante padrão
    } else {
      setMostrarEstrategicas(true);
      setCursor(null); // Resetar o cursor ao mudar o filtro
      setFiltroRelevancia('Relevante'); // Manter relevante para estratégicas
    }
  };

  const columns = getColumns(noticias, setNoticias, mostrarEstrategicas);

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

  const buscarPontosDasNoticias = async (noticias) => {
    try {
      const response = await fetch('https://smi-api-production-fae2.up.railway.app/noticias/pontos');
      if (!response.ok) {
        throw new Error('Falha ao buscar pontos das notícias');
      }
      const pontos = await response.json();
      
      const noticiasComPontos = noticias.map(noticia => {
        const noticiaPontos = pontos.find(p => p.id === noticia.id);
        let pontosNoticia = noticiaPontos ? noticiaPontos.pontos : 0;
        
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
      return noticias;
    }
  };

  useEffect(() => {
    console.log('useEffect iniciado');
    setIsLoading(true);
    setError(null);
    const from = dateRange.from.toISOString().split('T')[0];
    const to = dateRange.to.toISOString().split('T')[0];
    console.log('Chamando API com from:', from, 'e to:', to, 'cursor:', cursor, 'limit:', limit);

    let url
