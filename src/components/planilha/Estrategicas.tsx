import React, { useState, useEffect } from 'react';
import { Noticia, ColumnDef } from '@/types/noticia';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { TituloCell } from '@/pages/Spreadsheet';

const API_BASE_URL = 'https://smi-api-production-fae2.up.railway.app';

interface EstrategicasProps {
  noticias: Noticia[];
  setNoticias: React.Dispatch<React.SetStateAction<Noticia[]>>;
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
  const { id, estrategica } = row;
  const [cicloSelecionado, setCicloSelecionado] = useState<number | ''>('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

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

  return (
    <div className="relative">
      <select
        value={cicloSelecionado}
        onChange={(e) => {
          const novoCiclo = e.target.value === '' ? '' : Number(e.target.value);
          setCicloSelecionado(novoCiclo);
          handleSave(novoCiclo);
        }}
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
  const { id, ciclo, estrategica } = row;
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Resetar o estado de categoriaSelecionada quando o ciclo for null
  useEffect(() => {
    if (!ciclo) {
      setCategoriaSelecionada('');
    }
  }, [ciclo]);

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

  return (
    <div className="relative">
      <select
        value={categoriaSelecionada}
        onChange={(e) => {
          const novaCategoria = e.target.value;
          setCategoriaSelecionada(novaCategoria);
          handleSave(novaCategoria);
        }}
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
  const { id, categoria, ciclo, estrategica } = row;
  const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Resetar o estado de subcategoriaSelecionada quando a categoria for null
  useEffect(() => {
    if (!categoria) {
      setSubcategoriaSelecionada('');
    }
  }, [categoria]);

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

  return (
    <div className="relative">
      <select
        value={subcategoriaSelecionada}
        onChange={(e) => {
          const novaSubcategoria = e.target.value;
          setSubcategoriaSelecionada(novaSubcategoria);
          handleSave(novaSubcategoria);
        }}
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

function EstrategicaCell({ row, setNoticias, onEstrategicaChange }: { 
  row: Noticia; 
  setNoticias: React.Dispatch<React.SetStateAction<Noticia[]>>;
  onEstrategicaChange: (id: number, checked: boolean) => void;
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
      <Checkbox
        checked={isChecked}
        onCheckedChange={handleChange}
        disabled={isSaving}
        className="border-white/20 data-[state=checked]:bg-yellow-200 data-[state=checked]:border-yellow-200"
      />
    </div>
  );
}

function Estrategicas({ noticias, setNoticias }: EstrategicasProps): EstrategicasReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [ciclosDisponiveis, setCiclosDisponiveis] = useState<number[]>([]);
  const [categoriasPorCiclo, setCategoriasPorCiclo] = useState<{ [noticiaId: number]: string[] }>({});
  const [subcategoriasPorCategoria, setSubcategoriasPorCategoria] = useState<{ [noticiaId: number]: string[] }>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchCiclos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/semana-estrategica`);
        if (!response.ok) throw new Error(`Falha ao buscar semanas estratégicas: ${response.statusText}`);
        const semanas: SemanaEstrategica[] = await response.json();
        console.log('Resposta da API /semana-estrategica:', semanas);
        const ciclosUnicos = [...new Set(semanas.map(semana => semana.ciclo))].sort((a, b) => a - b);
        console.log('Ciclos distintos extraídos:', ciclosUnicos);
        setCiclosDisponiveis(ciclosUnicos);
      } catch (error: any) {
        console.error('Erro ao buscar semanas estratégicas:', error.message);
        toast({
          title: 'Erro ao carregar ciclos',
          description: 'Não foi possível carregar os ciclos. Verifique o backend.',
          variant: 'destructive',
        });
        setCiclosDisponiveis([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCiclos();
  }, []);

  const handleCicloChange = async (noticiaId: number, ciclo: number | null) => {
    const noticia = noticias.find(n => n.id === noticiaId);
    if (!noticia?.estrategica) {
      setCategoriasPorCiclo((prev) => ({
        ...prev,
        [noticiaId]: [],
      }));
      setSubcategoriasPorCategoria((prev) => ({
        ...prev,
        [noticiaId]: [],
      }));
      return;
    }

    if (ciclo) {
      try {
        const response = await fetch(`${API_BASE_URL}/semana-estrategica`);
        if (!response.ok) throw new Error('Falha ao buscar semanas estratégicas');
        const semanas: SemanaEstrategica[] = await response.json();
        const categorias = [...new Set(
          semanas
            .filter(semana => semana.ciclo === ciclo)
            .map(semana => semana.categoria)
        )];
        console.log(`Categorias para o ciclo ${ciclo}:`, categorias);
        setCategoriasPorCiclo((prev) => ({
          ...prev,
          [noticiaId]: categorias,
        }));
        setSubcategoriasPorCategoria((prev) => ({
          ...prev,
          [noticiaId]: [],
        }));
      } catch (error: any) {
        console.error('Erro ao buscar categorias:', error.message);
        toast({
          title: 'Erro ao carregar categorias',
          description: 'Não foi possível carregar as categorias. Tente novamente.',
          variant: 'destructive',
        });
      }
    } else {
      setCategoriasPorCiclo((prev) => ({
        ...prev,
        [noticiaId]: [],
      }));
      setSubcategoriasPorCategoria((prev) => ({
        ...prev,
        [noticiaId]: [],
      }));
    }
  };

  const handleCategoriaChange = async (noticiaId: number, categoria: string | null, ciclo: number | null) => {
    const noticia = noticias.find(n => n.id === noticiaId);
    if (!noticia?.estrategica) {
      setSubcategoriasPorCategoria((prev) => ({
        ...prev,
        [noticiaId]: [],
      }));
      return;
    }

    if (categoria && ciclo) {
      try {
        const response = await fetch(`${API_BASE_URL}/semana-estrategica`);
        if (!response.ok) throw new Error('Falha ao buscar semanas estratégicas');
        const semanas: SemanaEstrategica[] = await response.json();
        const subcategorias = [...new Set(
          semanas
            .filter(semana => semana.ciclo === ciclo && semana.categoria === categoria)
            .map(semana => semana.subcategoria)
        )];
        console.log(`Subcategorias para o ciclo ${ciclo} e categoria ${categoria}:`, subcategorias);
        setSubcategoriasPorCategoria((prev) => ({
          ...prev,
          [noticiaId]: subcategorias,
        }));
      } catch (error: any) {
        console.error('Erro ao buscar subcategorias:', error.message);
        toast({
          title: 'Erro ao carregar subcategorias',
          description: 'Não foi possível carregar as subcategorias. Tente novamente.',
          variant: 'destructive',
        });
      }
    } else {
      setSubcategoriasPorCategoria((prev) => ({
        ...prev,
        [noticiaId]: [],
      }));
    }
  };

  const handleEstrategicaChange = (noticiaId: number, checked: boolean) => {
    if (!checked) {
      setCategoriasPorCiclo((prev) => ({
        ...prev,
        [noticiaId]: [],
      }));
      setSubcategoriasPorCategoria((prev) => ({
        ...prev,
        [noticiaId]: [],
      }));
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
          categoriasPorCiclo={categoriasPorCiclo[row.id] || []} 
          onCategoriaChange={(id, categoria) => handleCategoriaChange(id, categoria, row.ciclo)}
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
          subcategoriasPorCategoria={subcategoriasPorCategoria[row.id] || []} 
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