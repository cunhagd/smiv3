
import React from 'react';
import Navbar from '@/components/Navbar';
import DataTable from '@/components/DataTable';
import { Calendar } from 'lucide-react';

// Mock data
const newsData = [
  {
    id: '1',
    data: '2023-05-15',
    veiculo: 'Estado de Minas',
    titulo: 'Governo anuncia investimento em infraestrutura',
    editoria: 'Política',
    autor: 'Carlos Silva',
    sentimento: 'Positivo',
    alcance: '250K',
  },
  {
    id: '2',
    data: '2023-05-14',
    veiculo: 'O Tempo',
    titulo: 'Secretaria de Saúde lança campanha de vacinação',
    editoria: 'Saúde',
    autor: 'Maria Oliveira',
    sentimento: 'Positivo',
    alcance: '180K',
  },
  {
    id: '3',
    data: '2023-05-13',
    veiculo: 'Globo Minas',
    titulo: 'Atraso em obras gera reclamações',
    editoria: 'Cidade',
    autor: 'Pedro Souza',
    sentimento: 'Negativo',
    alcance: '350K',
  },
  {
    id: '4',
    data: '2023-05-12',
    veiculo: 'Rádio Itatiaia',
    titulo: 'Audiência pública debate orçamento estadual',
    editoria: 'Economia',
    autor: 'Ana Pereira',
    sentimento: 'Neutro',
    alcance: '120K',
  },
  {
    id: '5',
    data: '2023-05-11',
    veiculo: 'Portal UAI',
    titulo: 'Governo apresenta resultados do primeiro trimestre',
    editoria: 'Economia',
    autor: 'Roberto Lima',
    sentimento: 'Positivo',
    alcance: '90K',
  },
  {
    id: '6',
    data: '2023-05-10',
    veiculo: 'Band Minas',
    titulo: 'Protesto contra aumento de impostos',
    editoria: 'Política',
    autor: 'Juliana Costa',
    sentimento: 'Negativo',
    alcance: '200K',
  },
  {
    id: '7',
    data: '2023-05-09',
    veiculo: 'Jornal Hoje em Dia',
    titulo: 'Inauguração de nova escola estadual',
    editoria: 'Educação',
    autor: 'Marcos Santos',
    sentimento: 'Positivo',
    alcance: '150K',
  },
  {
    id: '8',
    data: '2023-05-08',
    veiculo: 'TV Alterosa',
    titulo: 'Entrevista com o Governador sobre planos futuros',
    editoria: 'Política',
    autor: 'Carla Diniz',
    sentimento: 'Neutro',
    alcance: '280K',
  },
  {
    id: '9',
    data: '2023-05-07',
    veiculo: 'Rádio CBN',
    titulo: 'Debate sobre reforma administrativa',
    editoria: 'Política',
    autor: 'Lucas Oliveira',
    sentimento: 'Neutro',
    alcance: '100K',
  },
  {
    id: '10',
    data: '2023-05-06',
    veiculo: 'G1 Minas',
    titulo: 'Obras na Linha Verde causam congestionamento',
    editoria: 'Trânsito',
    autor: 'Fernanda Dias',
    sentimento: 'Negativo',
    alcance: '220K',
  },
];

const columns = [
  {
    id: 'data',
    header: 'Data',
    accessorKey: 'data',
    sortable: true,
    cell: (info: any) => {
      const date = new Date(info.data);
      return date.toLocaleDateString('pt-BR');
    },
  },
  {
    id: 'veiculo',
    header: 'Veículo',
    accessorKey: 'veiculo',
    sortable: true,
  },
  {
    id: 'titulo',
    header: 'Título',
    accessorKey: 'titulo',
    sortable: true,
  },
  {
    id: 'editoria',
    header: 'Editoria',
    accessorKey: 'editoria',
    sortable: true,
  },
  {
    id: 'autor',
    header: 'Autor',
    accessorKey: 'autor',
    sortable: true,
  },
  {
    id: 'sentimento',
    header: 'Sentimento',
    accessorKey: 'sentimento',
    sortable: true,
    cell: (info: any) => {
      const sentiment = info.sentimento;
      let bgColor = 'bg-gray-400';
      let textColor = 'text-black';
      
      if (sentiment === 'Positivo') {
        bgColor = 'bg-brand-yellow';
      } else if (sentiment === 'Negativo') {
        bgColor = 'bg-brand-red';
      } else if (sentiment === 'Neutro') {
        bgColor = 'bg-gray-400';
      }
      
      return (
        <span className={`${bgColor} ${textColor} text-xs px-2 py-1 rounded-full`}>
          {sentiment}
        </span>
      );
    },
  },
  {
    id: 'alcance',
    header: 'Alcance',
    accessorKey: 'alcance',
    sortable: true,
  },
];

const Spreadsheet = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar />
      
      <main className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Planilha de Matérias</h1>
            <p className="text-gray-400">Gerenciamento e análise de notícias</p>
          </div>
          
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <div className="flex items-center gap-2 px-3 py-2 bg-dark-card border border-white/10 rounded-lg">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm">Últimos 30 dias</span>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <DataTable data={newsData} columns={columns} />
        </div>
      </main>
    </div>
  );
};

export default Spreadsheet;
