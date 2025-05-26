import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X } from "lucide-react";
import axios from "axios";
import moment from "moment";
import DatePicker from "@/components/DateRangePicker";
import PortalSelect from "@/components/PortalSelect";

interface NoticiaFormData {
  data: Date;
  portal: string;
  titulo: string;
  link: string;
  corpo: string;
  tema: string;
  relevancia: string;
  avaliacao: string;
  estrategica: string;
}

interface AdicionarNoticiaProps {
  setMessage: React.Dispatch<React.SetStateAction<{ type: "success" | "error"; text: string } | null>>;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

const API_BASE_URL = "https://smi-api-production-fae2.up.railway.app";

const AdicionarNoticia: React.FC<AdicionarNoticiaProps> = ({ setMessage, onSubmitSuccess, onCancel }) => {
  const noticiaForm = useForm<NoticiaFormData>({
    defaultValues: {
      data: new Date(),
      portal: "",
      titulo: "",
      link: "",
      corpo: "",
      tema: "",
      relevancia: "",
      avaliacao: "",
      estrategica: "",
    },
  });

  const onNoticiaSubmit = async (data: NoticiaFormData) => {
    try {
      setMessage(null);
      const formattedData = {
        data: moment(data.data).format("DD/MM/YYYY"),
        portal: data.portal,
        titulo: data.titulo,
        link: data.link,
        corpo: data.corpo,
        tema: data.tema,
        relevancia: data.relevancia,
        avaliacao: data.avaliacao,
        estrategica: data.estrategica,
      };

      console.log("Enviando para API (Notícia):", formattedData);
      const response = await axios.post(`${API_BASE_URL}/noticias-postagem`, formattedData);
      setMessage({ type: "success", text: "Notícia adicionada com sucesso!" });
      noticiaForm.reset({
        data: new Date(),
        portal: "",
        titulo: "",
        link: "",
        corpo: "",
        tema: "",
        relevancia: "",
        avaliacao: "",
        estrategica: "",
      });
      console.log("Resposta da API (Notícia):", response.data);
      onSubmitSuccess?.();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Erro ao adicionar notícia. Tente novamente.";
      setMessage({ type: "error", text: errorMessage });
      console.error("Erro na API (Notícia):", error.response?.data || error.message);
    }
  };

  const isNoticiaFormValid =
    !!noticiaForm.watch("titulo") &&
    !!noticiaForm.watch("portal") &&
    !!noticiaForm.watch("link") &&
    !!noticiaForm.watch("tema") &&
    !!noticiaForm.watch("relevancia") &&
    !!noticiaForm.watch("avaliacao") &&
    !!noticiaForm.watch("estrategica") &&
    !!noticiaForm.watch("data");

  return (
    <Card className="bg-[#141414] border border-white/10">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">Adicionar Notícia</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={noticiaForm.handleSubmit(onNoticiaSubmit)} className="space-y-5">
          <div className="grid gap-2">
            <label htmlFor="data" className="text-sm font-medium">Data</label>
            <Controller
              name="data"
              control={noticiaForm.control}
              render={({ field }) => (
                <DatePicker
                  onChange={(date) => field.onChange(date || new Date())}
                />
              )}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="portal" className="text-sm font-medium">Portal</label>
            <Controller
              name="portal"
              control={noticiaForm.control}
              render={({ field }) => (
                <PortalSelect
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                />
              )}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="titulo" className="text-sm font-medium">Título</label>
            <input
              type="text"
              id="titulo"
              {...noticiaForm.register("titulo")}
              className="bg-[#121212] border border-white/20 rounded-lg p-3 text-white focus:border-[#f5a340] focus:ring-1 focus:ring-[#f5a340] transition-all"
              placeholder="Título da notícia"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="link" className="text-sm font-medium">Link</label>
            <input
              type="url"
              id="link"
              {...noticiaForm.register("link")}
              className="bg-[#121212] border border-white/20 rounded-lg p-3 text-white focus:border-[#f5a340] focus:ring-1 focus:ring-[#f5a340] transition-all"
              placeholder="https://"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="corpo" className="text-sm font-medium">Corpo</label>
            <textarea
              id="corpo"
              {...noticiaForm.register("corpo")}
              className="bg-[#121212] border border-white/20 rounded-lg p-3 text-white min-h-[120px] focus:border-[#f5a340] focus:ring-1 focus:ring-[#f5a340] transition-all"
              placeholder="Corpo da notícia"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="tema" className="text-sm font-medium">Tema</label>
            <select
              id="tema"
              {...noticiaForm.register("tema")}
              className="bg-[#121212] border border-white/20 rounded-lg p-3 text-white focus:border-[#f5a340] focus:ring-1 focus:ring-[#f5a340] transition-all"
            >
              <option value="">Selecione um tema</option>
              <option value="Agricultura">Agricultura</option>
              <option value="Social">Social</option>
              <option value="Segurança Pública">Segurança Pública</option>
              <option value="Saúde">Saúde</option>
              <option value="Política">Política</option>
              <option value="Meio Ambiente">Meio Ambiente</option>
              <option value="Infraestrutura">Infraestrutura</option>
              <option value="Educação">Educação</option>
              <option value="Economia">Economia</option>
              <option value="Cultura">Cultura</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="relevancia" className="text-sm font-medium">Utilidade</label>
            <select
              id="relevancia"
              {...noticiaForm.register("relevancia")}
              className="bg-[#121212] border border-white/20 rounded-lg p-3 text-white focus:border-[#f5a340] focus:ring-1 focus:ring-[#f5a340] transition-all"
            >
              <option value="">Selecione a utilidade</option>
              <option value="Útil">Útil</option>
              <option value="Suporte">Suporte</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="avaliacao" className="text-sm font-medium">Avaliação</label>
            <select
              id="avaliacao"
              {...noticiaForm.register("avaliacao")}
              className="bg-[#121212] border border-white/20 rounded-lg p-3 text-white focus:border-[#f5a340] focus:ring-1 focus:ring-[#f5a340] transition-all"
            >
              <option value="">Selecione a avaliação</option>
              <option value="Positiva">Positiva</option>
              <option value="Neutra">Neutra</option>
              <option value="Negativa">Negativa</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="estrategica" className="text-sm font-medium">Estratégica</label>
            <select
              id="estrategica"
              {...noticiaForm.register("estrategica")}
              className="bg-[#121212] border border-white/20 rounded-lg p-3 text-white focus:border-[#f5a340] focus:ring-1 focus:ring-[#f5a340] transition-all"
            >
              <option value="">Selecione</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
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
              disabled={!isNoticiaFormValid}
              className={`flex items-center gap-2 px-4 py-2 bg-dark-card border border-white/10 rounded-lg text-sm text-white hover:bg-[#f5a340]/20 hover:border-[#f5a340]/50 transition-all duration-300 ${
                !isNoticiaFormValid ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <Save className="h-5 w-5 text-[#f5a340] hover:text-[#f5b86e] transition-colors" />
              <span>Salvar Notícia</span>
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdicionarNoticia;