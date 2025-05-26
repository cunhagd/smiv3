import React, { useState, useEffect, useRef } from "react";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Portal {
  nome: string;
  pontos: number;
  abrangencia: string;
  prioridade: string;
  url: string;
}

interface FilterState {
  nome: string;
  pontos: string;
  abrangencia: string;
  prioridade: string;
  url: string;
}

interface FiltroPortalCadastradoProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onClear: () => void;
  portais: Portal[];
  onFilterChange: (filters: FilterState) => void;
}

const FiltroPortalCadastrado: React.FC<FiltroPortalCadastradoProps> = ({
  searchTerm,
  onSearchChange,
  onClear,
  portais,
  onFilterChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    nome: searchTerm,
    pontos: "",
    abrangencia: "",
    prioridade: "",
    url: "",
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Sync searchTerm with filters.nome
  useEffect(() => {
    setFilters((prev) => ({ ...prev, nome: searchTerm }));
  }, [searchTerm]);

  // Apply filters when they change
  useEffect(() => {
    onFilterChange(filters);
    // If nome filter changes, update searchTerm for backward compatibility
    if (filters.nome !== searchTerm) {
      onSearchChange(filters.nome);
    }
  }, [filters, onFilterChange, onSearchChange, searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveFilter(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterClick = () => {
    setIsOpen(!isOpen);
    setActiveFilter(null);
  };

  const handleFilterOptionClick = (filterType: string) => {
    setActiveFilter(filterType);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilter = (key: keyof FilterState) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
    if (key === "nome") {
      onClear(); // Maintain compatibility with existing clear behavior
    }
  };

  const handleClearAllFilters = () => {
    setFilters({
      nome: "",
      pontos: "",
      abrangencia: "",
      prioridade: "",
      url: "",
    });
    onClear();
    setIsOpen(false);
    setActiveFilter(null);
    toast({
      title: "Filtros limpos",
      description: "Todos os filtros foram removidos.",
      variant: "default",
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  const getButtonLabel = () => {
    const activeFilters = Object.entries(filters)
      .filter(([_, value]) => value !== "")
      .map(([key, value]) => `${key}: ${value}`);
    return activeFilters.length > 0 ? activeFilters.join(", ") : "";
  };

  return (
    <div className="relative inline-flex items-center gap-2" ref={dropdownRef}>
      <span
        onClick={handleFilterClick}
        className="cursor-pointer text-[#72c5fd] hover:text-[#bde4fe] transition-colors"
        title={getButtonLabel() || "Filtrar"}
      >
        <SlidersHorizontal className="text-white" />
      </span>
      {hasActiveFilters && (
        <button
          onClick={handleClearAllFilters}
          className="flex items-center gap-1 px-2 py-1 bg-[#f87171] text-white rounded-md hover:bg-[#fb9191] transition-colors focus:outline-none focus:ring-2 focus:ring-[#f87171]/50"
          title="Limpar filtros"
        >
          <X className="h-4 w-4" />
          <span className="text-sm font-medium">Limpar</span>
        </button>
      )}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-64 rounded-md shadow-lg bg-dark-card border border-white/10 top-full right-0">
          <div className="p-2">
            {!activeFilter ? (
              <div className="flex flex-col">
                <button
                  onClick={() => handleFilterOptionClick("nome")}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  Filtrar por Portal
                </button>
                <button
                  onClick={() => handleFilterOptionClick("pontos")}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  Filtrar por Pontos
                </button>
                <button
                  onClick={() => handleFilterOptionClick("abrangencia")}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  Filtrar por Abrangência
                </button>
                <button
                  onClick={() => handleFilterOptionClick("prioridade")}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  Filtrar por Prioridade
                </button>
                <button
                  onClick={() => handleFilterOptionClick("url")}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  Filtrar por URL
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center border-b border-white/10 pb-2">
                  <Search className="h-4 w-4 text-gray-400 mr-2" />
                  {activeFilter === "nome" && (
                    <>
                      <input
                        type="text"
                        placeholder="Buscar portal..."
                        value={filters.nome}
                        onChange={(e) => handleFilterChange("nome", e.target.value)}
                        className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
                      />
                      {filters.nome && (
                        <button
                          onClick={() => handleClearFilter("nome")}
                          className="text-gray-400 hover:text-white mr-2"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </>
                  )}
                  {activeFilter === "pontos" && (
                    <>
                      <input
                        type="number"
                        placeholder="Pontos..."
                        value={filters.pontos}
                        onChange={(e) => handleFilterChange("pontos", e.target.value)}
                        className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
                        min="0"
                      />
                      {filters.pontos && (
                        <button
                          onClick={() => handleClearFilter("pontos")}
                          className="text-gray-400 hover:text-white mr-2"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </>
                  )}
                  {activeFilter === "abrangencia" && (
                    <>
                      <select
                        value={filters.abrangencia}
                        onChange={(e) => handleFilterChange("abrangencia", e.target.value)}
                        className="w-full bg-dark-card text-white focus:outline-none text-sm border border-white/10 rounded"
                      >
                        <option value="">Selecione</option>
                        <option value="Nacional">Nacional</option>
                        <option value="Regional">Regional</option>
                        <option value="Local">Local</option>
                      </select>
                      {filters.abrangencia && (
                        <button
                          onClick={() => handleFilterChange("abrangencia", "")}
                          className="text-gray-400 hover:text-white mr-2"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </>
                  )}
                  {activeFilter === "prioridade" && (
                    <>
                      <select
                        value={filters.prioridade}
                        onChange={(e) => handleFilterChange("prioridade", e.target.value)}
                        className="w-full bg-dark-card text-white focus:outline-none text-sm border border-white/10 rounded"
                      >
                        <option value="">Selecione</option>
                        <option value="Alta">Alta</option>
                        <option value="Média">Média</option>
                        <option value="Baixa">Baixa</option>
                      </select>
                      {filters.prioridade && (
                        <button
                          onClick={() => handleFilterChange("prioridade", "")}
                          className="text-gray-400 hover:text-white mr-2"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </>
                  )}
                  {activeFilter === "url" && (
                    <>
                      <input
                        type="text"
                        placeholder="Buscar URL..."
                        value={filters.url}
                        onChange={(e) => handleFilterChange("url", e.target.value)}
                        className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
                      />
                      {filters.url && (
                        <button
                          onClick={() => handleClearFilter("url")}
                          className="text-gray-400 hover:text-white mr-2"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
                {activeFilter === "nome" && (
                  <div className="max-h-60 overflow-y-auto">
                    {portais
                      .filter((portal) =>
                        portal.nome.toLowerCase().includes(filters.nome.toLowerCase())
                      )
                      .length === 0 ? (
                      <div className="p-2 text-gray-400 text-sm">Nenhum portal encontrado</div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleClearFilter("nome")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-white/10"
                        >
                          Todos os portais
                        </button>
                        {portais
                          .filter((portal) =>
                            portal.nome.toLowerCase().includes(filters.nome.toLowerCase())
                          )
                          .map((portal) => (
                            <button
                              key={portal.nome}
                              onClick={() => handleFilterChange("nome", portal.nome)}
                              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                            >
                              {portal.nome}
                            </button>
                          ))}
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltroPortalCadastrado;