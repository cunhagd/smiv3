import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface PortalFormData {
  nome: string;
  pontos: number;
  abrangencia: string;
  prioridade: string;
  url: string;
}

interface Notification {
  type: "success" | "error";
  text: string;
}

interface AdicionarPortalProps {
  setMessage: React.Dispatch<React.SetStateAction<{ type: "success" | "error"; text: string } | null>>;
  onSubmitSuccess?: (data: PortalFormData & { id?: number }) => void;
  onCancel?: () => void;
}

const API_BASE_URL = "https://smi-api-production-fae2.up.railway.app";

const Notification: React.FC<{ type: Notification["type"]; text: string; onClose: () => void }> = ({ type, text, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed bottom-4 right-4 bg-[#141414]/80 backdrop-blur-md border ${type === "success" ? "border-[#CAF10A]" : "border-[#ED155A]"} rounded-lg shadow-lg p-4 max-w-sm flex items-center gap-4`}
      role="alert"
      aria-live="assertive"
    >
      <span className={`text-base font-medium ${type === "success" ? "text-[#CAF10A]" : "text-[#ED155A]"}`}>{text}</span>
      <button
        onClick={onClose}
        className="text-[#A50CE8] hover:text-[#AD8AEB] transition-colors"
        aria-label="Fechar notificação"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onClose()}
      >
        <X className="h-5 w-5" />
      </button>
    </motion.div>
  );
};

const AdicionarPortal: React.FC<AdicionarPortalProps> = ({ onSubmitSuccess, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<PortalFormData>({
    defaultValues: {
      nome: "",
      pontos: 0,
      abrangencia: "",
      prioridade: "",
      url: "",
    },
  });
  const [notification, setNotification] = useState<Notification | null>(null);

  const onPortalSubmit = async (data: PortalFormData) => {
    try {
      setNotification(null);
      const formattedData = {
        nome: data.nome,
        pontos: data.pontos,
        abrangencia: data.abrangencia,
        prioridade: data.prioridade,
        url: data.url,
      };

      console.log("Enviando para API (Portais):", formattedData);
      const response = await axios.post(`${API_BASE_URL}/portais`, formattedData);
      setNotification({ type: "success", text: "Portal adicionado com sucesso!" });
      reset({
        nome: "",
        pontos: 0,
        abrangencia: "",
        prioridade: "",
        url: "",
      });
      console.log("Resposta da API (Portais):", response.data);
      onSubmitSuccess?.({ ...formattedData, id: response.data.id });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Erro ao adicionar portal. Tente novamente.";
      setNotification({ type: "error", text: errorMessage });
      console.error("Erro na API (Portais):", error.response?.data || error.message);
    }
  };

  const isPortalFormValid =
    !!watch("nome") &&
    !!watch("pontos") &&
    !!watch("abrangencia") &&
    !!watch("prioridade") &&
    !!watch("url");

  return (
    <>
      <Card className="bg-[#141414]/80 backdrop-blur-md border border-white/10 rounded-xl shadow-lg w-full max-w-2xl mx-auto">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
            Adicionar Portal
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onPortalSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <label htmlFor="nome" className="text-base font-medium text-white">
                  Nome <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="nome"
                  {...register("nome", { required: "Nome é obrigatório" })}
                  className={`bg-[#121212] border ${errors.nome ? "border-red-400" : "border-white/20"} rounded-lg p-4 text-base text-white focus:border-[#CAF10A] focus:ring-2 focus:ring-[#CAF10A] transition-all`}
                  placeholder="Nome do Portal"
                  aria-invalid={errors.nome ? "true" : "false"}
                  aria-describedby={errors.nome ? "nome-error" : undefined}
                />
                {errors.nome && (
                  <p id="nome-error" className="text-sm text-red-400">{errors.nome.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <label htmlFor="pontos" className="text-base font-medium text-white">
                  Pontos <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  id="pontos"
                  {...register("pontos", { required: "Pontos são obrigatórios", valueAsNumber: true, min: { value: 0, message: "Pontos não podem ser negativos" } })}
                  className={`bg-[#121212] border ${errors.pontos ? "border-red-400" : "border-white/20"} rounded-lg p-4 text-base text-white focus:border-[#CAF10A] focus:ring-2 focus:ring-[#CAF10A] transition-all`}
                  placeholder="Pontuação do Portal"
                  aria-invalid={errors.pontos ? "true" : "false"}
                  aria-describedby={errors.pontos ? "pontos-error" : undefined}
                />
                {errors.pontos && (
                  <p id="pontos-error" className="text-sm text-red-400">{errors.pontos.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <label htmlFor="abrangencia" className="text-base font-medium text-white">
                  Abrangência <span className="text-red-400">*</span>
                </label>
                <select
                  id="abrangencia"
                  {...register("abrangencia", { required: "Abrangência é obrigatória" })}
                  className={`bg-[#121212] border ${errors.abrangencia ? "border-red-400" : "border-white/20"} rounded-lg p-4 text-base text-white focus:border-[#CAF10A] focus:ring-2 focus:ring-[#CAF10A] transition-all`}
                  aria-invalid={errors.abrangencia ? "true" : "false"}
                  aria-describedby={errors.abrangencia ? "abrangencia-error" : undefined}
                >
                  <option value="" className="text-gray-400">Selecione a abrangência</option>
                  <option value="Nacional">Nacional</option>
                  <option value="Regional">Regional</option>
                  <option value="Local">Local</option>
                </select>
                {errors.abrangencia && (
                  <p id="abrangencia-error" className="text-sm text-red-400">{errors.abrangencia.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <label htmlFor="prioridade" className="text-base font-medium text-white">
                  Prioridade <span className="text-red-400">*</span>
                </label>
                <select
                  id="prioridade"
                  {...register("prioridade", { required: "Prioridade é obrigatória" })}
                  className={`bg-[#121212] border ${errors.prioridade ? "border-red-400" : "border-white/20"} rounded-lg p-4 text-base text-white focus:border-[#CAF10A] focus:ring-2 focus:ring-[#CAF10A] transition-all`}
                  aria-invalid={errors.prioridade ? "true" : "false"}
                  aria-describedby={errors.prioridade ? "prioridade-error" : undefined}
                >
                  <option value="" className="text-gray-400">Selecione a prioridade</option>
                  <option value="Alta">Alta</option>
                  <option value="Média">Média</option>
                  <option value="Baixa">Baixa</option>
                </select>
                {errors.prioridade && (
                  <p id="prioridade-error" className="text-sm text-red-400">{errors.prioridade.message}</p>
                )}
              </div>

              <div className="grid gap-2 md:col-span-2">
                <label htmlFor="url" className="text-base font-medium text-white">
                  URL <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  id="url"
                  {...register("url", { required: "URL é obrigatória", pattern: { value: /^https?:\/\/[^\s$.?#].[^\s]*$/, message: "URL inválida" } })}
                  className={`bg-[#121212] border ${errors.url ? "border-red-400" : "border-white/20"} rounded-lg p-4 text-base text-white focus:border-[#CAF10A] focus:ring-2 focus:ring-[#CAF10A] transition-all`}
                  placeholder="https://exemplo.com"
                  aria-invalid={errors.url ? "true" : "false"}
                  aria-describedby={errors.url ? "url-error" : undefined}
                />
                {errors.url && (
                  <p id="url-error" className="text-sm text-red-400">{errors.url.message}</p>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-[#141414]/80 backdrop-blur-md pt-4 -mx-6 px-6 border-t border-white/10">
              <div className="flex justify-end gap-4">
                <motion.button
                  type="button"
                  onClick={onCancel}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#A50CE8] to-[#7B0AB7] rounded-lg text-base font-medium text-white hover:from-[#AD8AEB] hover:to-[#8A2BE2] transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-5 w-5" />
                  Cancelar
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={!isPortalFormValid}
                  className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#CAF10A] to-[#A3D008] rounded-lg text-base font-medium text-black hover:from-[#D6FF33] hover:to-[#B3E008] transition-all ${
                    !isPortalFormValid ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
                  whileHover={{ scale: isPortalFormValid ? 1.05 : 1 }}
                  whileTap={{ scale: isPortalFormValid ? 0.95 : 1 }}
                >
                  <Save className="h-5 w-5" />
                  Salvar Portal
                </motion.button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <AnimatePresence>
        {notification && (
          <Notification
            type={notification.type}
            text={notification.text}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AdicionarPortal;