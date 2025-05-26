import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import axios from "axios";

interface Portal {
  nome: string;
  pontos: number;
  abrangencia: string;
  prioridade: string;
  url: string;
}

interface PortaisCadastradosProps {
  portais: Portal[];
  setPortais: React.Dispatch<React.SetStateAction<Portal[]>>;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onClear: () => void;
}

const API_BASE_URL = "https://smi-api-production-fae2.up.railway.app";

const PortaisCadastrados: React.FC<PortaisCadastradosProps> = ({
  portais,
  setPortais,
  searchTerm,
  onSearchChange,
  onClear,
}) => {
  const [filteredPortais, setFilteredPortais] = useState<Portal[]>(portais);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const filtered = portais.filter((portal) =>
      portal.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPortais(filtered);
  }, [searchTerm, portais]);

  const handleDelete = async (nome: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/portais/cadastrados/${encodeURIComponent(nome)}`);
      const updatedPortais = portais.filter((portal) => portal.nome !== nome);
      setPortais(updatedPortais);
      setFilteredPortais(updatedPortais.filter((portal) =>
        portal.nome.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } catch (err) {
      setError("Erro ao excluir portal.");
      console.error(err);
    }
  };

  return (
    <Card className="bg-[#141414] border border-white/10">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">Portais Cadastrados</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-red-400">{error}</div>
        ) : filteredPortais.length === 0 ? (
          <div className="text-gray-400">Nenhum portal encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-2 px-4">Nome</th>
                  <th className="py-2 px-4">Pontos</th>
                  <th className="py-2 px-4">Abrangência</th>
                  <th className="py-2 px-4">Prioridade</th>
                  <th className="py-2 px-4">URL</th>
                  <th className="py-2 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPortais.map((portal) => (
                  <tr key={portal.nome} className="border-b border-white/10">
                    <td className="py-2 px-4">{portal.nome}</td>
                    <td className="py-2 px-4">{portal.pontos}</td>
                    <td className="py-2 px-4">{portal.abrangencia}</td>
                    <td className="py-2 px-4">{portal.prioridade}</td>
                    <td className="py-2 px-4">
                      <a
                        href={portal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#f5a340] hover:underline"
                      >
                        {portal.url}
                      </a>
                    </td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleDelete(portal.nome)}
                        className="text-red-400 hover:text-red-300"
                        aria-label="Excluir portal"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortaisCadastrados;