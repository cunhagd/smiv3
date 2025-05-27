import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

interface Notification {
  type: "success" | "error";
  text: string;
}

interface AdicionarNoticiaProps {
  setMessage: React.Dispatch<React.SetStateAction<{ type: "success" | "error"; text: string } | null>>;
  onSubmitSuccess?: () => void;
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

const AdicionarNoticia: React.FC<AdicionarNoticiaProps> = ({ onSubmitSuccess, onCancel }) => {
  const { register, handleSubmit, control, formState: { errors }, reset, watch } = useForm<NoticiaFormData>({
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
  const [notification, setNotification] = useState<Notification | null>(null);

  const onNoticiaSubmit = async (data: NoticiaFormData) => {
    try {
      setNotification(null);
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
      setNotification({ type: "success", text: "Notícia adicionada com sucesso!" });
      reset({
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
      setNotification({ type: "error", text: errorMessage });
      console.error("Erro na API (Notícia):", error.response?.data || error.message);
    }
  };

  const isNoticiaFormValid =
    !!watch("titulo") &&
    !!watch("portal") &&
    !!watch("link") &&
    !!watch("tema") &&
    !!watch("relevancia") &&
    !!watch("avaliacao") &&
    !!watch("estrategica") &&
    !!watch("data");

  return (
    <>
      <Card className="bg-[#141414]/80 backdrop-blur-md border border-white/10 rounded-xl shadow-lg w-full max-w-2xl mx-auto">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-white">Adicionar Notícia</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onNoticiaSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <label htmlFor="data" className="text-base font-medium text-white">
                  Data <span className="text-red-400">*</span>
                </label>
                <Controller
                  name="data"
                  control={control}
                  rules={{ required: "Data é obrigatória" }}
                  render={({ field }) => (
                    <DatePicker
                      onChange={(date) => field.onChange(date || new Date())}
                    />
                  )}
                />
                {errors.data && (
                  <p id="data-error" className="text-sm text-red-400">{errors.data.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <label htmlFor="portal" className="text-base font-medium text-white">
                  Portal <span className="text-red-400">*</span>
                </label>
                <Controller
                  name="portal"
                  control={control}
                  rules={{ required: "Portal é obrigatório" }}
                  render={({ field }) => (
                    <PortalSelect
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
                />
                {errors.portal && (
                  <p id="portal-error" className="text-sm text-red-400">{errors.portal.message}</p>
                )}
              </div>

              <div className="grid gap-2 md:col-span-2">
                <label htmlFor="titulo" className="text-base font-medium text-white">
                  Título <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="titulo"
                  {...register("titulo", { required: "Título é obrigatório" })}
                  className={`bg-[#121212] border ${errors.titulo ? "border-red-400" : "border-white/20"} rounded-lg p-4 text-base text-white focus:border-[#CAF10A] focus:ring-2 focus:ring-[#CAF10A] transition-all`}
                  placeholder="Título da notícia"
                  aria-invalid={errors.titulo ? "true" : "false"}
                  aria-describedby={errors.titulo ? "titulo-error" : undefined}
                />
                {errors.titulo && (
                  <p id="titulo-error" className="text-sm text-red-400">{errors.titulo.message}</p>
                )}
              </div>

              <div className="grid gap-2 md:col-span-2">
                <label htmlFor="link" className="text-base font-medium text-white">
                  Link <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  id="link"
                  {...register("link", { required: "Link é obrigatório", pattern: { value: /^https?:\/\/[^\s$.?#].[^\s]*$/, message: "URL inválida" } })}
                  className={`bg-[#121212] border ${errors.link ? "border-red-400" : "border-white/20"} rounded-lg p-4 text-base text-white focus:border-[#CAF10A] focus:ring-2 focus:ring-[#CAF10A] transition-all`}
                  placeholder="https://exemplo.com"
                  aria-invalid={errors.link ? "true" : "false"}
                  aria-describedby={errors.link ? "link-error" : undefined}
                />
                {errors.link && (
                  <p id="link-error" className="text-sm text-red-400">{errors.link.message}</p>
                )}
              </div>

              <div className="grid gap-2 md:col-span-2">
                <label htmlFor="corpo" className="text-base font-medium text-white">
                  Corpo
                </label>
                <textarea
                  id="corpo"
                  {...register("corpo")}
                  className={`bg-[#121212] border ${errors.corpo ? "border-red-400" : "border-white/20"} rounded-lg p-4 text-base text-white min-h-[120px] focus:border-[#CAF10A] focus:ring-2 focus:ring-[#CAF10A] transition-all`}
                  placeholder="Corpo da notícia"
                  aria-invalid={errors.corpo ? "true" : "false"}
                  aria-describedby={errors.corpo ? "corpo-error" : undefined}
                />
                {errors.corpo && (
                  <p id="corpo-error" className="text-sm text-red-400">{errors.corpo.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <label htmlFor="tema" className="text-base font-medium text-white">
                  Tema <span className="text-red-400">*</span>
                </label>
                <select
                  id="tema"
                  {...register("tema", { required: "Tema é obrigatório" })}
                  className={`bg-[#121212] border ${errors.tema ? "border-red-400" : "border-white/20"} rounded-lg p-4 text-base text-white focus:border-[#CAF10A] focus:ring-2 focus:ring-[#CAF10A] transition-all`}
                  aria-invalid={errors.tema ? "true" : "false"}
                  aria-describedby={errors.tema ? "tema-error" : undefined}
                >
                  <option value="" className="text-gray-400">Selecione um tema</option>
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
                {errors.tema && (
                  <p id="tema-error" className="text-sm text-red-400">{errors.tema.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <label htmlFor="relevancia" className="text-base font-medium text-white">
                  Utilidade <span className="text-red-400">*</span>
                </label>
                <select
                  id="relevancia"
                  {...register("relevancia", { required: "Utilidade é obrigatória" })}
                  className={`bg-[#121212] border ${errors.relevancia ? "border-red-400" : "border-white/20"} rounded-lg p-4 text-base text-white focus:border-[#CAF10A] focus:ring-2 focus:ring-[#CAF10A] transition-all`}
                  aria-invalid={errors.relevancia ? "true" : "false"}
                  aria-describedby={errors.relevancia ? "relevancia-error" : undefined}
                >
                  <option value="" className="text-gray-400">Selecione a utilidade</option>
                  <option value="Útil">Útil</option>
                  <option value="Suporte">Suporte</option>
                </select>
                {errors.relevancia && (
                  <p id="relevancia-error" className="text-sm text-red-400">{errors.relevancia.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <label htmlFor="avaliacao" className="text-base font-medium text-white">
                  Avaliação <span className="text-red-400">*</span>
                </label>
                <select
                  id="avaliacao"
                  {...register("avaliacao", { required: "Avaliação é obrigatória" })}
                  className={`bg-[#121212] border ${errors.avaliacao ? "border-red-400" : "border-white/20"} rounded-lg p-4 text-base text-white focus:border-[#CAF10A] focus:ring-2 focus:ring-[#CAF10A] transition-all`}
                  aria-invalid={errors.avaliacao ? "true" : "false"}
                  aria-describedby={errors.avaliacao ? "avaliacao-error" : undefined}
                >
                  <option value="" className="text-gray-400">Selecione a avaliação</option>
                  <option value="Positiva">Positiva</option>
                  <option value="Neutra">Neutra</option>
                  <option value="Negativa">Negativa</option>
                </select>
                {errors.avaliacao && (
                  <p id="avaliacao-error" className="text-sm text-red-400">{errors.avaliacao.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <label htmlFor="estrategica" className="text-base font-medium text-white">
                  Estratégica <span className="text-red-400">*</span>
                </label>
                <select
                  id="estrategica"
                  {...register("estrategica", { required: "Estratégica é obrigatória" })}
                  className={`bg-[#121212] border ${errors.estrategica ? "border-red-400" : "border-white/20"} rounded-lg p-4 text-base text-white focus:border-[#CAF10A] focus:ring-2 focus:ring-[#CAF10A] transition-all`}
                  aria-invalid={errors.estrategica ? "true" : "false"}
                  aria-describedby={errors.estrategica ? "estrategica-error" : undefined}
                >
                  <option value="" className="text-gray-400">Selecione</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
                {errors.estrategica && (
                  <p id="estrategica-error" className="text-sm text-red-400">{errors.estrategica.message}</p>
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
                  disabled={!isNoticiaFormValid}
                  className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#CAF10A] to-[#A3D008] rounded-lg text-base font-medium text-black hover:from-[#D6FF33] hover:to-[#B3E008] transition-all ${
                    !isNoticiaFormValid ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
                  whileHover={{ scale: isNoticiaFormValid ? 1.05 : 1 }}
                  whileTap={{ scale: isNoticiaFormValid ? 0.95 : 1 }}
                >
                  <Save className="h-5 w-5" />
                  Salvar Notícia
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

export default AdicionarNoticia;