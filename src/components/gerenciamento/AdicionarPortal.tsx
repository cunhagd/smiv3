import React from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X } from "lucide-react";
import axios from "axios";

interface PortalFormData {
  nome: string;
  pontos: number;
  abrangencia: string;
  prioridade: string;
  url: string;
}

interface AdicionarPortalProps {
  setMessage: React.Dispatch<React.SetStateAction<{ type: "success" | "error"; text: string } | null>>;
  onSubmitSuccess?: (data: PortalFormData) => void;
  onCancel?: () => void;
}

const API_BASE_URL = "https://smi-api-production-fae2.up.railway.app";

const AdicionarPortal: React.FC<AdicionarPortalProps> = ({ setMessage, onSubmitSuccess, onCancel }) => {
  const portalForm = useForm<PortalFormData>({
    defaultValues: {
      nome: "",
      pontos: 0,
      abrangencia: "",
      prioridade: "",
      url: "",
    },
  });

  const onPortalSubmit = async (data: PortalFormData) => {
    try {
      setMessage(null);
      const formattedData = {
        nome: data.nome,
        pontos: data.pontos,
        abrangencia: data.abrangencia,
        prioridade: data.prioridade,
        url: data.url,
      };

      console.log("Enviando para API (Portais):", formattedData);
      const response = await axios.post(`${API_BASE_URL}/portais`, formattedData);
      setMessage({ type: "success", text: "Portal adicionado com sucesso!" });
      portalForm.reset({
        nome: "",
        pontos: 0,
        abrangencia: "",
        prioridade: "",
        url: "",
      });
      console.log("Resposta da API (Portais):", response.data);
      onSubmitSuccess?.(formattedData);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Erro ao adicionar portal. Tente novamente.";
      setMessage({ type: "error", text: errorMessage });
      console.error("Erro na API (Portais):", error.response?.data || error.message);
    }
  };

  const isPortalFormValid =
    !!portalForm.watch("nome") &&
    !!portalForm.watch("pontos") &&
    !!portalForm.watch("abrangencia") &&
    !!portalForm.watch("prioridade") &&
    !!portalForm.watch("url");

  return (
    <Card className="bg-[#141414] border border-white/10">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">Adicionar Portal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={portalForm.handleSubmit(onPortalSubmit)} className="space-y-5">
          <div className="grid gap-2">
            <label htmlFor="nome" className="text-sm font-medium">Nome</label>
            <input
              type="text"
              id="nome"
              {...portalForm.register("nome")}
              className="bg-[#121212] border border-white/20 rounded-lg p-3 text-white focus:border-[#f5a340] focus:ring-1 focus:ring-[#f5a340] transition-all"
              placeholder="Nome do Portal"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="pontos" className="text-sm font-medium">Pontos</label>
            <input
              type="number"
              id="pontos"
              {...portalForm.register("pontos", { valueAsNumber: true })}
              className="bg-[#121212] border border-white/20 rounded-lg p-3 text-white focus:border-[#f5a340] focus:ring-1 focus:ring-[#f5a340] transition-all"
              placeholder="Pontuação do Portal"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="abrangencia" className="text-sm font-medium">Abrangência</label>
            <select
              id="abrangencia"
              {...portalForm.register("abrangencia")}
              className="bg-[#121212] border border-white/20 rounded-lg p-3 text-white focus:border-[#f5a340] focus:ring-1 focus:ring-[#f5a340] transition-all"
            >
              <option value="">Selecione a abrangência</option>
              <option value="Nacional">Nacional</option>
              <option value="Regional">Regional</option>
              <option value="Local">Local</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="prioridade" className="text-sm font-medium">Prioridade</label>
            <select
              id="prioridade"
              {...portalForm.register("prioridade")}
              className="bg-[#121212] border border-white/20 rounded-lg p-3 text-white focus:border-[#f5a340] focus:ring-1 focus:ring-[#f5a340] transition-all"
            >
              <option value="">Selecione a prioridade</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="url" className="text-sm font-medium">URL</label>
            <input
              type="url"
              id="url"
              {...portalForm.register("url")}
              className="bg-[#121212] border border-white/20 rounded-lg p-3 text-white focus:border-[#f5a340] focus:ring-1 focus:ring-[#f5a340] transition-all"
              placeholder="https://"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 bg-dark-card border border-white/10 rounded-lg text-sm text-white hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300"
            >
              <X className="h-5 w-5 text-red-400 hover:text-red-300 transition-colors" />
              <span>Cancelar</span>
            </button>
            <button
              type="submit"
              disabled={!isPortalFormValid}
              className={`flex items-center gap-2 px-4 py-2 bg-dark-card border border-white/10 rounded-lg text-sm text-white hover:bg-[#CAF10A]/20 hover:border-[#CAF10A]/50 transition-all duration-300 ${
                !isPortalFormValid ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <Save className="h-5 w-5 text-[#CAF10A] hover:text-[#CAF163] transition-colors" />
              <span>Salvar Portal</span>
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdicionarPortal;