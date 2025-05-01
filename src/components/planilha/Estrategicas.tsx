import React, { useState } from 'react';
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

const CATEGORIAS = [
  'Infraestrutura',
  'Educação',
  'Saúde',
  'Segurança',
  'Economia',
  'Meio Ambiente',
  'Social',
  'Cultura',
  'Política',
  'Outros',
];

const SUBCATEGORIAS = {
  Infraestrutura: ['Transporte', 'Energia', 'Saneamento', 'Habitação'],
  Educação: ['Ensino Básico', 'Ensino Superior', 'Educação Infantil', 'Capacitação'],
  Saúde: ['Prevenção', 'Tratamento', 'Hospitais', 'Saúde Mental'],
  Segurança: ['Polícia', 'Prevenção ao Crime', 'Segurança Digital', 'Defesa Civil'],
  Economia: ['Emprego', 'Indústria', 'Comércio', 'Agricultura'],
  MeioAmbiente: ['Desmatamento', 'Mudanças Climáticas', 'Reciclagem', 'Biodiversidade'],
  Social: ['Inclusão', 'Assistência Social', 'Direitos Humanos', 'Juventude'],
  Cultura: ['Patrimônio', 'Eventos Culturais', 'Arte', 'Turismo'],
  Política: ['Legislação', 'Eleições', 'Governança', 'Transparência'],
  Outros: ['Tecnologia', 'Esportes', 'Internacional', 'Diversos'],
};

const CICLOS = [1, 2, 3, 4, 5];

function CategoriaCell({ row, setNoticias }: { row: Noticia; setNoticias: React.Dispatch<React.SetStateAction<Noticia[]>> }) {
  const { id, categoria } = row;
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>(categoria || '');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async (novaCategoria: string) => {
    const valorEnviado = novaCategoria === '' ? null : novaCategoria;
    if (valorEnviado !== categoria) {
      setIsSaving(true);
      try {
        const response = await fetch(`${API_BASE_URL}/noticias/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categoria: valorEnviado }),
        });
        if (!response.ok) throw new Error('Falha ao salvar categoria');
        setNoticias((prevNoticias) =>
          prevNoticias.map((noticia) =>
            noticia.id === id ? { ...noticia, categoria: valorEnviado } : noticia
          )
        );
      } catch (error: any) {
        toast({
          title: 'Erro ao salvar',
          description: 'Não foi possível salvar a categoria. Tente novamente.',
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
        value={categoriaSelecionada}
        onChange={(e) => {
          const novaCategoria = e.target.value;
          setCategoriaSelecionada(novaCategoria);
          handleSave(novaCategoria);
        }}
        disabled={isSaving}
        className="p-1 pl-2 pr-8 bg-dark-card border border-white/10 rounded text-sm text-white w-full min-w-[140px] text-left appearance-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30 hover:border-white/20 transition-all"
      >
        <option value="">Selecionar</option>
        {CATEGORIAS.map((cat) => (
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

function SubcategoriaCell({ row, setNoticias }: { row: Noticia; setNoticias: React.Dispatch<React.SetStateAction<Noticia[]>> }) {
  const { id, categoria, subcategoria } = row;
  const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState<string>(subcategoria || '');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const subcategorias = categoria ? SUBCATEGORIAS[categoria as keyof typeof SUBCATEGORIAS] || [] : [];

  const handleSave = async (novaSubcategoria: string) => {
    const valorEnviado = novaSubcategoria === '' ? null : novaSubcategoria;
    if (valorEnviado !== subcategoria) {
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
        disabled={isSaving || !categoria}
        className="p-1 pl-2 pr-8 bg-dark-card border border-white/10 rounded text-sm text-white w-full min-w-[140px] text-left appearance-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30 hover:border-white/20 transition-all disabled:opacity-50"
      >
        <option value="">Selecionar</option>
        {subcategorias.map((subcat) => (
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

function CicloCell({ row, setNoticias }: { row: Noticia; setNoticias: React.Dispatch<React.SetStateAction<Noticia[]>> }) {
  const { id, ciclo } = row;
  const [cicloSelecionado, setCicloSelecionado] = useState<number | ''>(ciclo || '');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async (novoCiclo: number | '') => {
    const valorEnviado = novoCiclo === '' ? null : novoCiclo;
    if (valorEnviado !== ciclo) {
      setIsSaving(true);
      try {
        const response = await fetch(`${API_BASE_URL}/noticias/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ciclo: valorEnviado }),
        });
        if (!response.ok) throw new Error('Falha ao salvar ciclo');
        setNoticias((prevNoticias) =>
          prevNoticias.map((noticia) =>
            noticia.id === id ? { ...noticia, ciclo: valorEnviado } : noticia
          )
        );
      } catch (error: any) {
        toast({
          title: 'Erro ao salvar',
          description: 'Não foi possível salvar o ciclo. Tente novamente.',
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
        value={cicloSelecionado}
        onChange={(e) => {
          const novoCiclo = e.target.value === '' ? '' : Number(e.target.value);
          setCicloSelecionado(novoCiclo);
          handleSave(novoCiclo);
        }}
        disabled={isSaving}
        className="p-1 pl-2 pr-8 bg-dark-card border border-white/10 rounded text-sm text-white w-full min-w-[140px] text-left appearance-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30 hover:border-white/20 transition-all"
      >
        <option value="">Selecionar</option>
        {CICLOS.map((ciclo) => (
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
          className="border-white/20 data-[state=checked]:bg-yellow-200 data-[state=checked]:border-yellow-200"
        />
      </div>
    );
  }

function Estrategicas({ noticias, setNoticias }: EstrategicasProps): EstrategicasReturn {
  const [isLoading] = useState(false);

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
      cell: ({ row }) => <CicloCell row={row} setNoticias={setNoticias} />,
    },
    {
      id: 'categoria',
      header: 'Categoria',
      accessorKey: 'categoria',
      sortable: true,
      cell: ({ row }) => <CategoriaCell row={row} setNoticias={setNoticias} />,
    },
    {
      id: 'subcategoria',
      header: 'Subcategoria',
      accessorKey: 'subcategoria',
      sortable: true,
      cell: ({ row }) => <SubcategoriaCell row={row} setNoticias={setNoticias} />,
    },
    {
    id: 'estrategica',
    header: 'Estratégica',
    accessorKey: 'estrategica',
    sortable: true,
    cell: ({ row }) => <EstrategicaCell row={row} setNoticias={setNoticias} />,
  },
  ];

  return {
    columns,
    isLoading,
  };
}

export default Estrategicas;