import React, { useState, useEffect, useRef } from 'react';
import { SlidersHorizontal, Search, X, Smile, Frown, Meh } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Noticia {
  portal: string;
  tema: string;
  avaliacao: string;
  [key: string]: any;
}

interface ApiResponse {
  data: Noticia[];
}

interface FiltroGlobalProps {
  selectedDate: Date | undefined;
  onFilterChange: (filter: { portal: string | null; title: string | null; tema: string | null; avaliacao: string | null }) => void;
}

const FiltroGlobal: React.FC<FiltroGlobalProps> = ({ selectedDate, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPortalFilter, setShowPortalFilter] = useState(false);
  const [showTitleFilter, setShowTitleFilter] = useState(false);
  const [showTemaFilter, setShowTemaFilter] = useState(false);
  const [showAvaliacaoFilter, setShowAvaliacaoFilter] = useState(false);
  const [portais, setPortais] = useState<string[]>([]);
  const [filteredPortais, setFilteredPortais] = useState<string[]>([]);
  const [temas, setTemas] = useState<string[]>([]);
  const [filteredTemas, setFilteredTemas] = useState<string[]>([]);
  const [portalSearchTerm, setPortalSearchTerm] = useState('');
  const [titleSearchTerm, setTitleSearchTerm] = useState('');
  const [temaSearchTerm, setTemaSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPortal, setSelectedPortal] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [selectedTema, setSelectedTema] = useState<string | null>(null);
  const [selectedAvaliacao, setSelectedAvaliacao] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const temaInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Buscar portais e temas da API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const dateFormatted = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
        const url = `https://smi-api-production-fae2.up.railway.app/noticias?all=true${dateFormatted ? `&date=${dateFormatted}` : ''}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Falha ao buscar dados');
        const responseData: ApiResponse = await response.json();
        const uniquePortais = Array.from(new Set(responseData.data.map((noticia) => noticia.portal).filter(Boolean))).sort();
        const uniqueTemas = Array.from(new Set(responseData.data.map((noticia) => noticia.tema).filter(Boolean))).sort();
        setPortais(uniquePortais);
        setFilteredPortais(uniquePortais);
        setTemas(uniqueTemas);
        setFilteredTemas(uniqueTemas);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setPortais([]);
        setFilteredPortais([]);
        setTemas([]);
        setFilteredTemas([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  // Filtrar portais com base no termo de busca
  useEffect(() => {
    const filtered = portais.filter((portal) =>
      portal.toLowerCase().includes(portalSearchTerm.toLowerCase())
    );
    setFilteredPortais(filtered);
  }, [portalSearchTerm, portais]);

  // Filtrar temas com base no termo de busca
  useEffect(() => {
    const filtered = temas.filter((tema) =>
      tema.toLowerCase().includes(temaSearchTerm.toLowerCase())
    );
    setFilteredTemas(filtered);
  }, [temaSearchTerm, temas]);

  // Atualizar filtro de portal em tempo real
  useEffect(() => {
    if (showPortalFilter) {
      const debounce = setTimeout(() => {
        const portal = portalSearchTerm.trim() || null;
        setSelectedPortal(portal);
        onFilterChange({ portal, title: selectedTitle, tema: selectedTema, avaliacao: selectedAvaliacao });
      }, 300);
      return () => clearTimeout(debounce);
    }
  }, [portalSearchTerm, selectedTitle, selectedTema, selectedAvaliacao, showPortalFilter, onFilterChange]);

  // Atualizar filtro de título em tempo real
  useEffect(() => {
    if (showTitleFilter) {
      const debounce = setTimeout(() => {
        const title = titleSearchTerm.trim() || null;
        setSelectedTitle(title);
        onFilterChange({ portal: selectedPortal, title, tema: selectedTema, avaliacao: selectedAvaliacao });
      }, 300);
      return () => clearTimeout(debounce);
    }
  }, [titleSearchTerm, selectedPortal, selectedTema, selectedAvaliacao, showTitleFilter, onFilterChange]);

  // Atualizar filtro de tema em tempo real
  useEffect(() => {
    if (showTemaFilter) {
      const debounce = setTimeout(() => {
        const tema = temaSearchTerm.trim() || null;
        setSelectedTema(tema);
        onFilterChange({ portal: selectedPortal, title: selectedTitle, tema, avaliacao: selectedAvaliacao });
      }, 300);
      return () => clearTimeout(debounce);
    }
  }, [temaSearchTerm, selectedPortal, selectedTitle, selectedAvaliacao, showTemaFilter, onFilterChange]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowPortalFilter(false);
        setShowTitleFilter(false);
        setShowTemaFilter(false);
        setShowAvaliacaoFilter(false);
        setPortalSearchTerm('');
        setTemaSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focar no input de título ou tema ao abrir os respectivos filtros
  useEffect(() => {
    if (showTitleFilter && titleInputRef.current) {
      titleInputRef.current.focus();
    } else if (showTemaFilter && temaInputRef.current) {
      temaInputRef.current.focus();
    }
  }, [showTitleFilter, showTemaFilter]);

  const handleFilterClick = () => {
    setIsOpen(!isOpen);
    setShowPortalFilter(false);
    setShowTitleFilter(false);
    setShowTemaFilter(false);
    setShowAvaliacaoFilter(false);
    setPortalSearchTerm('');
    setTemaSearchTerm('');
  };

  const handlePortalOptionClick = () => {
    setShowPortalFilter(true);
    setShowTitleFilter(false);
    setShowTemaFilter(false);
    setShowAvaliacaoFilter(false);
    setPortalSearchTerm(selectedPortal || '');
  };

  const handleTitleOptionClick = () => {
    setShowTitleFilter(true);
    setShowPortalFilter(false);
    setShowTemaFilter(false);
    setShowAvaliacaoFilter(false);
    setTitleSearchTerm(selectedTitle || '');
  };

  const handleTemaOptionClick = () => {
    setShowTemaFilter(true);
    setShowPortalFilter(false);
    setShowTitleFilter(false);
    setShowAvaliacaoFilter(false);
    setTemaSearchTerm(selectedTema || '');
  };

  const handleAvaliacaoOptionClick = () => {
    setShowAvaliacaoFilter(true);
    setShowPortalFilter(false);
    setShowTitleFilter(false);
    setShowTemaFilter(false);
  };

  const handlePortalSelect = (portal: string) => {
    setSelectedPortal(portal);
    setSelectedTitle(null);
    setSelectedTema(null);
    setSelectedAvaliacao(null);
    onFilterChange({ portal, title: null, tema: null, avaliacao: null });
    setIsOpen(false);
    setShowPortalFilter(false);
    setPortalSearchTerm('');
  };

  const handleTemaSelect = (tema: string) => {
    setSelectedTema(tema);
    setSelectedPortal(null);
    setSelectedTitle(null);
    setSelectedAvaliacao(null);
    onFilterChange({ portal: null, title: null, tema, avaliacao: null });
    setIsOpen(false);
    setShowTemaFilter(false);
    setTemaSearchTerm('');
  };

  const handleAvaliacaoSelect = (avaliacao: string) => {
    setSelectedAvaliacao(avaliacao);
    setSelectedPortal(null);
    setSelectedTitle(null);
    setSelectedTema(null);
    onFilterChange({ portal: null, title: null, tema: null, avaliacao });
    setIsOpen(false);
    setShowAvaliacaoFilter(false);
  };

  const handleClearFilter = () => {
    setSelectedPortal(null);
    setSelectedTitle(null);
    setSelectedTema(null);
    setSelectedAvaliacao(null);
    setTitleSearchTerm('');
    setPortalSearchTerm('');
    setTemaSearchTerm('');
    onFilterChange({ portal: null, title: null, tema: null, avaliacao: null });
    setIsOpen(false);
    setShowPortalFilter(false);
    setShowTitleFilter(false);
    setShowTemaFilter(false);
    setShowAvaliacaoFilter(false);
    toast({
      title: 'Filtros limpos',
      description: 'Todos os filtros foram removidos.',
      variant: 'default',
    });
  };

  const handleClearTitle = () => {
    setTitleSearchTerm('');
    setSelectedTitle(null);
    onFilterChange({ portal: selectedPortal, title: null, tema: selectedTema, avaliacao: selectedAvaliacao });
  };

  const handleClearPortal = () => {
    setPortalSearchTerm('');
    setSelectedPortal(null);
    onFilterChange({ portal: null, title: selectedTitle, tema: selectedTema, avaliacao: selectedAvaliacao });
  };

  const handleClearTema = () => {
    setTemaSearchTerm('');
    setSelectedTema(null);
    onFilterChange({ portal: selectedPortal, title: selectedTitle, tema: null, avaliacao: selectedAvaliacao });
  };

  const getButtonLabel = () => {
    if (selectedPortal) return `Portal: ${selectedPortal}`;
    if (selectedTitle) return `Título: ${selectedTitle}`;
    if (selectedTema) return `Tema: ${selectedTema}`;
    if (selectedAvaliacao) return `Avaliação: ${selectedAvaliacao}`;
    return '';
  };

  const hasActiveFilters = selectedPortal || selectedTitle || selectedTema || selectedAvaliacao;

  return (
    <div className="relative inline-flex items-center gap-2" ref={dropdownRef}>
      <span
        onClick={handleFilterClick}
        className="cursor-pointer text-[#72c5fd] hover:text-[#bde4fe] transition-colors"
        title={getButtonLabel() || 'Filtrar'}
      >
        <SlidersHorizontal className="text-white" />
      </span>
      {hasActiveFilters && (
        <button
          onClick={handleClearFilter}
          className="flex items-center gap-1 px-2 py-1 bg-[#f87171] text-white rounded-md hover:bg-[#fb9191] transition-colors focus:outline-none focus:ring-2 focus:ring-[#f87171]/50"
          title="Limpar todos os filtros"
        >
          <X className="h-4 w-4" />
          <span className="text-sm font-medium">Limpar</span>
        </button>
      )}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-64 rounded-md shadow-lg bg-dark-card border border-white/10 top-full left-0">
          <div className="p-2">
            {!showPortalFilter && !showTitleFilter && !showTemaFilter && !showAvaliacaoFilter ? (
              <div className="flex flex-col">
                <button
                  onClick={handlePortalOptionClick}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  Filtrar por Portal
                </button>
                <button
                  onClick={handleTitleOptionClick}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  Filtrar por Título
                </button>
                <button
                  onClick={handleTemaOptionClick}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  Filtrar por Tema
                </button>
                <button
                  onClick={handleAvaliacaoOptionClick}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  Filtrar por Avaliação
                </button>
              </div>
            ) : showPortalFilter ? (
              <>
                <div className="flex items-center border-b border-white/10 pb-2">
                  <Search className="h-4 w-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Buscar portal..."
                    value={portalSearchTerm}
                    onChange={(e) => setPortalSearchTerm(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
                  />
                  {portalSearchTerm && (
                    <button
                      onClick={handleClearPortal}
                      className="text-gray-400 hover:text-white mr-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-2 text-gray-400 text-sm">Carregando portais...</div>
                  ) : filteredPortais.length === 0 ? (
                    <div className="p-2 text-gray-400 text-sm">Nenhum portal encontrado</div>
                  ) : (
                    <>
                      <button
                        onClick={handleClearFilter}
                        className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-white/10"
                      >
                        Todos os portais
                      </button>
                      {filteredPortais.map((portal) => (
                        <button
                          key={portal}
                          onClick={() => handlePortalSelect(portal)}
                          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                        >
                          {portal}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </>
            ) : showTitleFilter ? (
              <div className="flex items-center border-b border-white/10 pb-2">
                <Search className="h-4 w-4 text-gray-400 mr-2" />
                <input
                  ref={titleInputRef}
                  type="text"
                  placeholder="Buscar título..."
                  value={titleSearchTerm}
                  onChange={(e) => setTitleSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
                />
                {titleSearchTerm && (
                  <button
                    onClick={handleClearTitle}
                    className="text-gray-400 hover:text-white mr-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ) : showTemaFilter ? (
              <>
                <div className="flex items-center border-b border-white/10 pb-2">
                  <Search className="h-4 w-4 text-gray-400 mr-2" />
                  <input
                    ref={temaInputRef}
                    type="text"
                    placeholder="Buscar tema..."
                    value={temaSearchTerm}
                    onChange={(e) => setTemaSearchTerm(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
                  />
                  {temaSearchTerm && (
                    <button
                      onClick={handleClearTema}
                      className="text-gray-400 hover:text-white mr-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-2 text-gray-400 text-sm">Carregando temas...</div>
                  ) : filteredTemas.length === 0 ? (
                    <div className="p-2 text-gray-400 text-sm">Nenhum tema encontrado</div>
                  ) : (
                    <>
                      <button
                        onClick={handleClearFilter}
                        className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-white/10"
                      >
                        Todos os temas
                      </button>
                      {filteredTemas.map((tema) => (
                        <button
                          key={tema}
                          onClick={() => handleTemaSelect(tema)}
                          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                        >
                          {tema}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="p-2">
                <div className="flex justify-around">
                  <button
                    onClick={() => handleAvaliacaoSelect('Positiva')}
                    className="p-2 hover:bg-white/10 rounded"
                    title="Positiva"
                  >
                    <Smile className="h-6 w-6 text-[#34d399]" />
                  </button>
                  <button
                    onClick={() => handleAvaliacaoSelect('Neutra')}
                    className="p-2 hover:bg-white/10 rounded"
                    title="Neutra"
                  >
                    <Meh className="h-6 w-6 text-[#9ca3af]" />
                  </button>
                  <button
                    onClick={() => handleAvaliacaoSelect('Negativa')}
                    className="p-2 hover:bg-white/10 rounded"
                    title="Negativa"
                  >
                    <Frown className="h-6 w-6 text-[#f87171]" />
                  </button>
                </div>
                <button
                  onClick={handleClearFilter}
                  className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-white/10 mt-2"
                >
                  Todas as avaliações
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltroGlobal;