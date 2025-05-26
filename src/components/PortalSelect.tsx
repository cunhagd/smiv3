import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface PortalSelectProps {
  value: string;
  onChange: (value: string) => void;
}

interface ApiResponse {
  data: { portal: string }[];
}

const PortalSelect: React.FC<PortalSelectProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [portais, setPortais] = useState<string[]>([]);
  const [filteredPortais, setFilteredPortais] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Buscar portais da API
  useEffect(() => {
    const fetchPortais = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = `https://smi-api-production-fae2.up.railway.app/noticias?all=true`;
        const response = await fetch(url);
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Falha ao buscar portais: ${response.status} ${errorMessage}`);
        }
        const responseData: ApiResponse = await response.json();
        const uniquePortais = Array.from(new Set(responseData.data.map((noticia) => noticia.portal).filter(Boolean))).sort();
        setPortais(uniquePortais);
        setFilteredPortais(uniquePortais);
      } catch (error: any) {
        console.error('Erro ao buscar portais:', error);
        setError(error.message || 'Erro ao carregar portais. Tente novamente.');
        setPortais([]);
        setFilteredPortais([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPortais();
  }, []);

  // Filtrar portais com base no termo de busca
  useEffect(() => {
    const filtered = portais.filter((portal) =>
      portal.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPortais(filtered);
  }, [searchTerm, portais]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePortalSelect = (portal: string) => {
    onChange(portal);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleClearSelection = () => {
    onChange('');
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full flex items-center justify-between px-4 py-2 bg-dark-card border border-white/10 rounded-lg hover:bg-gray-200/10 hover:border-white/30 transition-all text-white text-sm"
          >
            <span>{value || 'Selecione um portal'}</span>
            <Search className="h-4 w-4 text-gray-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2 bg-dark-card border border-white/10 rounded-xl shadow-lg" align="start">
          <div className="flex items-center border-b border-white/10 pb-2">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Buscar portal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="text-gray-400 hover:text-white mr-2"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="p-2 text-gray-400 text-sm">Carregando portais...</div>
            ) : error ? (
              <div className="p-2 text-red-400 text-sm">{error}</div>
            ) : filteredPortais.length === 0 ? (
              <div className="p-2 text-gray-400 text-sm">Nenhum portal encontrado</div>
            ) : (
              <>
                <button
                  onClick={handleClearSelection}
                  className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-white/10"
                >
                  Nenhum portal
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
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PortalSelect;