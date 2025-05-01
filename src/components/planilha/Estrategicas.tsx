import React, { useState, useEffect, useMemo } from 'react';
import { Noticia, ColumnDef } from '@/types/noticia';
import { ChevronDown, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TituloCell } from '@/pages/Spreadsheet';

const API_BASE_URL = 'http://localhost:3000';

interface EstrategicasProps {
  noticias: Noticia[];
  setNoticias: React.Dispatch<React.SetStateAction<Noticia[]>>;
  onRowRemove?: (id: string, callback: () => void) => void;
  filterMode?: 'Nenhum' | 'Lixo' | 'Estrategica' | 'Suporte';
}

interface EstrategicasReturn {
  columns: ColumnDef[];
  isLoading: boolean;
}

interface SemanaEstrategica {
  id: number;
  data_inicial: string;
  data_final: string;
  ciclo: number;
  categoria: string;
  subcategoria: string;
}

function CicloCell({ 
  row, 
  setNoticias, 
  ciclosDisponiveis, 
  onCicloChange, 
}: { 
  row: Noticia; 
  setNoticias: React.Dispatch<React.SetStateAction<Noticia[]>>; 
  ciclosDisponiveis: number[];
  onCicloChange: (id: number, ciclo: number | null) => void;
}) {
  const { id, estrategica, ciclo } = row;
  const [cicloSelecionado, setCicloSelecionado] = useState<number | ''>(ciclo ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setCicloSelecionado(ciclo ?? '');
  }, [ciclo]);

  const handleSave = async (novoCiclo: number | '') => {
    const valorEnviado = novoCiclo === '' ? null : novoCiclo;
    setIsSaving(true);
    try {
      const body = {
        ciclo: valorEnviado,
        ...(novoCiclo === '' && { categoria: null, subcategoria: null }),
      };
      const response = await fetch(`${API_BASE_URL}/noticias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Falha ao salvar ciclo');
      setNoticias((prevNoticias) =>
        prevNoticias.map((noticia) =>
          noticia.id === id
            ? {
                ...noticia,
                ciclo: valorEnviado,
                ...(novoCiclo === '' && { categoria: null, subcategoria: null }),
              }
            : noticia
        )
      );
      onCicloChange(id, valorEnviado);
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar o ciclo. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const novoCiclo = e.target.value === '' ? '' : Number(e.target.value);
    setCicloSelecionado(novoCiclo);
    handleSave(novoCiclo);
  };

  return (
    <div className="relative">
      <select
        value={cicloSelecionado}
        onChange={handleChange}
        disabled={isSaving || !estrategica}
        className="p-1 pl-2 pr-8 bg-dark-card border border-white/10 rounded text-sm text-white w-full min-w-[140px] text-left appearance-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30 hover:border-white/20 transition-all disabled:opacity-50"
      >
        <option value="">Selecionar</option>
        {ciclosDisponiveis.map((ciclo) => (
          <option key={ciclo} value={ciclo}>
            Ciclo {ciclo}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/60">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
}

function CategoriaCell({ 
  row, 
  setNoticias, 
  categoriasPorCiclo, 
  onCategoriaChange,
}: { 
  row: Noticia; 
  setNoticias: React.Dispatch<React.SetStateAction<Noticia[]>>; 
  categoriasPorCiclo: string[];
  onCategoriaChange: (id: number, categoria: string | null) => void;
}) {
  const { id, ciclo, estrategica, categoria } = row;
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>(categoria ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!ciclo) {
      setCategoriaSelecionada('');
    } else {
      setCategoriaSelecionada(categoria ?? '');
    }
  }, [ciclo, categoria]);

  const handleSave = async (novaCategoria: string) => {
    const valorEnviado = novaCategoria === '' ? null : novaCategoria;
    setIsSaving(true);
    try {
      const body = {
        categoria: valorEnviado,
        ...(novaCategoria === '' && { subcategoria: null }),
      };
      const response = await fetch(`${API_BASE_URL}/noticias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Falha ao salvar categoria');
      setNoticias((prevNoticias) =>
        prevNoticias.map((noticia) =>
          noticia.id === id
            ? {
                ...noticia,
                categoria: valorEnviado,
                ...(novaCategoria === '' && { subcategoria: null }),
              }
            : noticia
        )
      );
      onCategoriaChange(id, valorEnviado);
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar a categoria. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const novaCategoria = e.target.value;
    setCategoriaSelecionada(novaCategoria);
    handleSave(novaCategoria);
  };

  return (
    <div className="relative">
      <select
        value={categoriaSelecionada}
        onChange={handleChange}
        disabled={isSaving || !ciclo || !estrategica}
        className="p-1 pl-2 pr-8 bg-dark-card border border-white/10 rounded text-sm text-white w-full min-w-[140px] text-left appearance-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30 hover:border-white/20 transition-all disabled:opacity-50"
      >
        <option value="">Selecionar</option>
        {categoriasPorCiclo.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/60">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
}

function SubcategoriaCell({ 
  row, 
  setNoticias, 
  subcategoriasPorCategoria 
}: { 
  row: Noticia; 
  setNoticias: React.Dispatch<React.SetStateAction<Noticia[]>>; 
  subcategoriasPorCategoria: string[];
}) {
  const { id, categoria, ciclo, estrategica, subcategoria } = row;
  const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState<string>(subcategoria ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!categoria || !ciclo) {
      setSubcategoriaSelecionada('');
    } else {
      setSubcategoriaSelecionada(subcategoria ?? '');
    }
  }, [categoria, subcategoria, ciclo]);

  const handleSave = async (novaSubcategoria: string) => {
    const valorEnviado = novaSubcategoria === '' ? null : novaSubcategoria;
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/noticias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subcategoria: valorEnviado }),
      });
      if (!response.ok) throw new Error('Falha ao salvar subcategoria');
      setNoticias((prevNoticias) =>
        prevNoticias.map((noticia) =>
          noticia.id === id ? { ...noticia, subcategoria: valorEnviado } : noticia
        )
      );
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar a subcategoria. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const novaSubcategoria = e.target.value;
    setSubcategoriaSelecionada(novaSubcategoria);
    handleSave(novaSubcategoria);
  };

  return (
    <div className="relative">
      <select
        value={subcategoriaSelecionada}
        onChange={handleChange}
        disabled={isSaving || !categoria || !ciclo || !estrategica}
        className="p-1 pl-2 pr-8 bg-dark-card border border-white/10 rounded text-sm text-white w-full min-w-[140px] text-left appearance-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30 hover:border-white/20 transition-all disabled:opacity-50"
      >
        <option value="">Selecionar</option>
        {subcategoriasPorCategoria.map((subcat) => (
          <option key={subcat} value={subcat}>
            {subcat}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/60">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
}

function EstrategicaCell({ 
  row, 
  setNoticias, 
  onEstrategicaChange, 
  onRowRemove, 
  filterMode 
}: { 
  row: Noticia; 
  setNoticias: React.Dispatch<React.SetStateAction<Noticia[]>>;
  onEstrategicaChange: (id: number, checked: boolean) => void;
  onRowRemove?: (id: string, callback: () => void) => void;
  filterMode?: 'Nenhum' | 'Lixo' | 'Estrategica' | 'Suporte';
}) {
  const { id, estrategica } = row;
  const [isChecked, setIsChecked] = useState(estrategica || false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleChange = async (checked: boolean) => {
    setIsChecked(checked);
    setIsSaving(true);
    try {
      const body = {
        estrategica: checked,
        ...(!checked && { ciclo: null, categoria: null, subcategoria: null }),
      };
      const response = await fetch(`${API_BASE_URL}/noticias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Falha ao salvar estratégica');
      setNoticias((prevNoticias) =>
        prevNoticias.map((noticia) =>
          noticia.id === id
            ? {
                ...noticia,
                estrategica: checked,
                ...(!checked && { ciclo: null, categoria: null, subcategoria: null }),
              }
            : noticia
        )
      );
      onEstrategicaChange(id, checked);

      if (onRowRemove && filterMode === 'Estrategica' && !checked) {
        onRowRemove(id.toString(), () => {
          setNoticias((prevNoticias) =>
            prevNoticias.filter((noticia) => noticia.id !== id)
          );
        });
      }
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
        onClick={() => handleChange(!isChecked)}
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

function Estrategicas({ noticias, setNoticias, onRowRemove, filterMode }: EstrategicasProps): EstrategicasReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [semanasEstrategicas, setSemanasEstrategicas] = useState<SemanaEstrategica[]>([]);
  const { toast } = useToast();

  // Buscar semanas estratégicas apenas uma vez ao montar o componente
  useEffect(() => {
    const fetchSemanas = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/semana-estrategica`);
        if (!response.ok) throw new Error(`Falha ao buscar semanas estratégicas: ${response.statusText}`);
        const semanas: SemanaEstrategica[] = await response.json();
        setSemanasEstrategicas(semanas);
      } catch (error: any) {
        console.error('Erro ao buscar semanas estratégicas:', error.message);
        toast({
          title: 'Erro ao carregar dados estratégicos',
          description: 'Não foi possível carregar os dados. Verifique o backend.',
          variant: 'destructive',
        });
        setSemanasEstrategicas([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSemanas();
  }, [toast]);

  // Mapas para acesso eficiente
  const ciclosDisponiveis = useMemo(() => {
    return [...new Set(semanasEstrategicas.map(semana => semana.ciclo))].sort((a, b) => a - b);
  }, [semanasEstrategicas]);

  const categoriasPorCicloMap = useMemo(() => {
    const map: { [ciclo: number]: string[] } = {};
    ciclosDisponiveis.forEach(ciclo => {
      const categorias = [
        ...new Set(
          semanasEstrategicas
            .filter(semana => semana.ciclo === ciclo)
            .map(semana => semana.categoria)
        ),
      ];
      map[ciclo] = categorias;
    });
    return map;
  }, [semanasEstrategicas, ciclosDisponiveis]);

  const subcategoriasPorCategoriaMap = useMemo(() => {
    const map: { [key: string]: string[] } = {};
    ciclosDisponiveis.forEach(ciclo => {
      const categorias = categoriasPorCicloMap[ciclo] || [];
      categorias.forEach(categoria => {
        const subcategorias = [
          ...new Set(
            semanasEstrategicas
              .filter(semana => semana.ciclo === ciclo && semana.categoria === categoria)
              .map(semana => semana.subcategoria)
          ),
        ];
        map[`${ciclo}-${categoria}`] = subcategorias;
      });
    });
    return map;
  }, [semanasEstrategicas, categoriasPorCicloMap, ciclosDisponiveis]);

  // Funções para obter categorias e subcategorias com base no ciclo e categoria
  const getCategoriasPorCiclo = (ciclo: number | null): string[] => {
    if (!ciclo) return [];
    return categoriasPorCicloMap[ciclo] || [];
  };

  const getSubcategoriasPorCategoria = (ciclo: number | null, categoria: string | null): string[] => {
    if (!ciclo || !categoria) return [];
    const key = `${ciclo}-${categoria}`;
    return subcategoriasPorCategoriaMap[key] || [];
  };

  // Funções para lidar com mudanças
  const handleCicloChange = (noticiaId: number, ciclo: number | null) => {
    const noticia = noticias.find(n => n.id === noticiaId);
    if (!noticia?.estrategica) {
      // Limpar categorias e subcategorias se não for estratégica
      setNoticias(prevNoticias =>
        prevNoticias.map(n =>
          n.id === noticiaId ? { ...n, categoria: null, subcategoria: null } : n
        )
      );
    }
  };

  const handleCategoriaChange = (noticiaId: number, categoria: string | null) => {
    const noticia = noticias.find(n => n.id === noticiaId);
    if (!noticia?.estrategica || !categoria) {
      // Limpar subcategorias se não for estratégica ou categoria for nula
      setNoticias(prevNoticias =>
        prevNoticias.map(n =>
          n.id === noticiaId ? { ...n, subcategoria: null } : n
        )
      );
    }
  };

  const handleEstrategicaChange = (noticiaId: number, checked: boolean) => {
    if (!checked) {
      // Limpar ciclo, categoria e subcategoria ao desmarcar estratégica
      setNoticias(prevNoticias =>
        prevNoticias.map(n =>
          n.id === noticiaId ? { ...n, ciclo: null, categoria: null, subcategoria: null } : n
        )
      );
    }
  };

  const columns: ColumnDef[] = [
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
      id: 'ciclo',
      header: 'Ciclo',
      accessorKey: 'ciclo',
      sortable: true,
      cell: ({ row }) => (
        <CicloCell 
          row={row} 
          setNoticias={setNoticias} 
          ciclosDisponiveis={ciclosDisponiveis} 
          onCicloChange={handleCicloChange} 
        />
      ),
    },
    {
      id: 'categoria',
      header: 'Categoria',
      accessorKey: 'categoria',
      sortable: true,
      cell: ({ row }) => (
        <CategoriaCell 
          row={row} 
          setNoticias={setNoticias} 
          categoriasPorCiclo={getCategoriasPorCiclo(row.ciclo)} 
          onCategoriaChange={handleCategoriaChange}
        />
      ),
    },
    {
      id: 'subcategoria',
      header: 'Subcategoria',
      accessorKey: 'subcategoria',
      sortable: true,
      cell: ({ row }) => (
        <SubcategoriaCell 
          row={row} 
          setNoticias={setNoticias} 
          subcategoriasPorCategoria={getSubcategoriasPorCategoria(row.ciclo, row.categoria)} 
        />
      ),
    },
    {
      id: 'estrategica',
      header: 'Estratégica',
      accessorKey: 'estrategica',
      sortable: true,
      cell: ({ row }) => (
        <EstrategicaCell 
          row={row} 
          setNoticias={setNoticias} 
          onEstrategicaChange={handleEstrategicaChange}
          onRowRemove={onRowRemove}
          filterMode={filterMode}
        />
      ),
    },
  ];

  return {
    columns,
    isLoading,
  };
}

export default Estrategicas;