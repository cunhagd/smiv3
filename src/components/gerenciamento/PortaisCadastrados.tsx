import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Save, Trash2, X } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface Portal {
  id: number;
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

const ABRANGENCIA_OPCOES = ["Nacional", "Regional", "Local"];
const PRIORIDADE_OPCOES = ["Alta", "Média", "Baixa"];

const PortaisCadastrados: React.FC<PortaisCadastradosProps> = ({
  portais,
  setPortais,
  searchTerm,
  onSearchChange,
  onClear,
}) => {
  const [filteredPortais, setFilteredPortais] = useState<Portal[]>(portais);
  const [error, setError] = useState<string | null>(null);
  const [editingNome, setEditingNome] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<Partial<Portal>>({});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const filtered = portais
      .filter((portal) =>
        portal.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.id - b.id); // Sort by id in ascending order
    setFilteredPortais(filtered);
  }, [searchTerm, portais]);

  const handleEdit = (portal: Portal) => {
    setEditingNome(portal.nome);
    setEditedData({
      id: portal.id,
      pontos: portal.pontos,
      abrangencia: portal.abrangencia,
      prioridade: portal.prioridade,
      url: portal.url,
    });
  };

  const handleFieldChange = (field: keyof Portal, value: any) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (nome: string) => {
    setIsSaving(true);
    try {
      if (!editedData.pontos || editedData.pontos < 0) {
        throw new Error("Pontos deve ser um número maior ou igual a zero.");
      }
      if (!editedData.abrangencia || !ABRANGENCIA_OPCOES.includes(editedData.abrangencia)) {
        throw new Error("Selecione uma abrangência válida.");
      }
      if (!editedData.prioridade || !PRIORIDADE_OPCOES.includes(editedData.prioridade)) {
        throw new Error("Selecione uma prioridade válida.");
      }
      if (!editedData.url || !isValidUrl(editedData.url)) {
        throw new Error("Informe uma URL válida.");
      }
      if (!editedData.id) {
        throw new Error("ID do portal não encontrado.");
      }

      const updatedPortal = {
        pontos: Number(editedData.pontos),
        abrangencia: editedData.abrangencia,
        prioridade: editedData.prioridade,
        url: editedData.url,
      };

      const response = await axios.put(
        `${API_BASE_URL}/portais/cadastrados/${editedData.id}`,
        updatedPortal
      );

      const updatedPortais = portais.map((p) =>
        p.nome === nome ? { ...p, ...updatedPortal } : p
      );
      setPortais(updatedPortais);
      setFilteredPortais(
        updatedPortais
          .filter((p) =>
            p.nome.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .sort((a, b) => a.id - b.id) // Ensure sorted after update
      );
      setEditingNome(null);
      setEditedData({});

      toast({
        title: "Sucesso!",
        description: "Portal atualizado com sucesso.",
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao atualizar portal.";
      setError(errorMessage);
      toast({
        title: "Erro ao atualizar",
        description: errorMessage,
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este portal?")) {
      return;
    }

    setIsSaving(true);
    try {
      await axios.delete(`${API_BASE_URL}/portais/cadastrados/${id}`);
      const updatedPortais = portais.filter((portal) => portal.id !== id);
      setPortais(updatedPortais);
      setFilteredPortais(
        updatedPortais
          .filter((p) =>
            p.nome.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .sort((a, b) => a.id - b.id) // Ensure sorted after deletion
      );

      toast({
        title: "Sucesso!",
        description: "Portal excluído com sucesso.",
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao excluir portal.";
      setError(errorMessage);
      toast({
        title: "Erro ao excluir",
        description: errorMessage,
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingNome(null);
    setEditedData({});
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Card className="bg-[#141414] border border-white/10">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">Portais Relevantes</CardTitle>
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
                  <th className="py-2 px-4">ID</th>
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
                    <td className="py-2 px-4">{portal.id}</td>
                    <td className="py-2 px-4">{portal.nome}</td>
                    <td className="py-2 px-4">
                      {editingNome === portal.nome ? (
                        <input
                          type="number"
                          value={editedData.pontos ?? portal.pontos}
                          onChange={(e) =>
                            handleFieldChange("pontos", Number(e.target.value))
                          }
                          className="bg-dark-card border border-white/20 rounded px-2 py-1 w-full"
                          aria-label="Editar pontos"
                          min="0"
                        />
                      ) : (
                        portal.pontos
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {editingNome === portal.nome ? (
                        <select
                          value={editedData.abrangencia ?? portal.abrangencia}
                          onChange={(e) =>
                            handleFieldChange("abrangencia", e.target.value)
                          }
                          className="bg-dark-card border border-white/20 rounded px-2 py-1 w-full"
                          aria-label="Editar abrangência"
                        >
                          {ABRANGENCIA_OPCOES.map((opcao) => (
                            <option key={opcao} value={opcao}>
                              {opcao}
                            </option>
                          ))}
                        </select>
                      ) : (
                        portal.abrangencia
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {editingNome === portal.nome ? (
                        <select
                          value={editedData.prioridade ?? portal.prioridade}
                          onChange={(e) =>
                            handleFieldChange("prioridade", e.target.value)
                          }
                          className="bg-dark-card border border-white/20 rounded px-2 py-1 w-full"
                          aria-label="Editar prioridade"
                        >
                          {PRIORIDADE_OPCOES.map((opcao) => (
                            <option key={opcao} value={opcao}>
                              {opcao}
                            </option>
                          ))}
                        </select>
                      ) : (
                        portal.prioridade
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {editingNome === portal.nome ? (
                        <input
                          type="url"
                          value={editedData.url ?? portal.url}
                          onChange={(e) =>
                            handleFieldChange("url", e.target.value)
                          }
                          className="bg-dark-card border border-white/20 rounded px-2 py-1 w-full"
                          aria-label="Editar URL"
                        />
                      ) : (
                        <a
                          href={portal.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                        >
                          {portal.url}
                        </a>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {editingNome === portal.nome ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSave(portal.nome)}
                            className="text-[#CAF10A] hover:text-[#CAF163]"
                            disabled={isSaving}
                            aria-label="Salvar alterações"
                          >
                            <Save size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(portal.id)}
                            className="text-[#f5a340] hover:text-[#f5b86e]"
                            disabled={isSaving}
                            aria-label="Excluir portal"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-red-400 hover:text-red-300"
                            disabled={isSaving}
                            aria-label="Cancelar edição"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(portal)}
                          className="text-blue-400 hover:text-blue-300"
                          aria-label="Editar portal"
                        >
                          <Pencil size={18} />
                        </button>
                      )}
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