export interface Noticia {
    id: number;
    data: string;
    portal: string;
    titulo: string;
    link: string;
    relevancia: string | null;
    tema: string | null;
    avaliacao: string | null;
    pontos: number;
    estrategica: boolean | null;
    categoria: string | null;
    subcategoria: string | null;
    ciclo: number | null;
  }
  
  export interface ColumnDef {
    id: string;
    header: string;
    accessorKey: string;
    sortable: boolean;
    cell?: ({ row }: { row: Noticia }) => JSX.Element;
  }