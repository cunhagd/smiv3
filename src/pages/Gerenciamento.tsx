import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import Navbar from "../components/Navbar";
import DatePicker from "@/components/DateRangePicker"; // Assuming single-date picker

interface NoticiaFormData {
  data?: Date;
  portal: string;
  titulo: string;
  link: string;
  corpo: string;
  tema: string;
  avaliacao: string;
  pontos: number;
  abrangencia: string;
  prioridade: string;
  estrategica: string;
}

interface PortalFormData {
  nome: string;
  data?: Date;
  pontos: number;
  abrangencia: string;
  prioridade: string;
  url: string;
}

const Gerenciamento = () => {
  const noticiaForm = useForm<NoticiaFormData>({
    defaultValues: {
      data: undefined,
      portal: "",
      titulo: "",
      link: "",
      corpo: "",
      tema: "",
      avaliacao: "",
      pontos: 0,
      abrangencia: "",
      prioridade: "",
      estrategica: "",
    },
  });

  const portalForm = useForm<PortalFormData>({
    defaultValues: {
      nome: "",
      data: undefined,
      pontos: 0,
      abrangencia: "",
      prioridade: "",
      url: "",
    },
  });

  const onNoticiaSubmit = (data: NoticiaFormData) => {
    console.log("Notícia:", data);
    // TODO: Implement API call (e.g., axios.post(`${API_BASE_URL}/noticias`, data))
  };

  const onPortalSubmit = (data: PortalFormData) => {
    console.log("Portal:", data);
    // TODO: Implement API call (e.g., axios.post(`${API_BASE_URL}/portais`, data))
  };

  const isNoticiaFormValid = !!noticiaForm.watch("titulo") && !!noticiaForm.watch("portal") && !!noticiaForm.watch("link");
  const isPortalFormValid = !!portalForm.watch("nome") && !!portalForm.watch("url");

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar />
      <main className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Gerenciamento</h1>
            <p className="text-gray-400">Cadastro de notícias e portais</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Adicionar Notícia */}
          <Card className="bg-[#141414] border border-white/10 text-white">
            <CardHeader>
              <CardTitle className="text-xl text-white">Adicionar Notícia</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={noticiaForm.handleSubmit(onNoticiaSubmit)} className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="data" className="text-sm">Data</label>
                  <Controller
                    name="data"
                    control={noticiaForm.control}
                    render={({ field }) => (
                      <DatePicker
                        onChange={(date) => field.onChange(date)}
                      />
                    )}
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="portal" className="text-sm">Portal</label>
                  <select
                    id="portal"
                    {...noticiaForm.register("portal")}
                    className="bg-[#121212] border border-white/20 rounded p-2 text-white"
                  >
                    <option value="">Selecione um portal</option>
                    <option value="g1">G1</option>
                    <option value="uol">UOL</option>
                    <option value="folha">Folha de São Paulo</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="titulo" className="text-sm">Título</label>
                  <input
                    type="text"
                    id="titulo"
                    {...noticiaForm.register("titulo")}
                    className="bg-[#121212] border border-white/20 rounded p-2 text-white"
                    placeholder="Título da notícia"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="link" className="text-sm">Link</label>
                  <input
                    type="url"
                    id="link"
                    {...noticiaForm.register("link")}
                    className="bg-[#121212] border border-white/20 rounded p-2 text-white"
                    placeholder="https://"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="corpo" className="text-sm">Corpo</label>
                  <textarea
                    id="corpo"
                    {...noticiaForm.register("corpo")}
                    className="bg-[#121212] border border-white/20 rounded p-2 text-white min-h-[100px]"
                    placeholder="Corpo da notícia"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="tema" className="text-sm">Tema</label>
                  <select
                    id="tema"
                    {...noticiaForm.register("tema")}
                    className="bg-[#121212] border border-white/20 rounded p-2 text-white"
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
                  <label htmlFor="avaliacao" className="text-sm">Avaliação</label>
                  <select
                    id="avaliacao"
                    {...noticiaForm.register("avaliacao")}
                    className="bg-[#121212] border border-white/20 rounded p-2 text-white"
                  >
                    <option value="">Selecione a avaliação</option>
                    <option value="Positiva">Positiva</option>
                    <option value="Negativa">Negativa</option>
                    <option value="Neutra">Neutra</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="pontos" className="text-sm">Pontos</label>
                  <input
                    type="number"
                    id="pontos"
                    {...noticiaForm.register("pontos", { valueAsNumber: true })}
                    className="bg-[#121212] border border-white/20 rounded p-2 text-white"
                    placeholder="Pontuação"
                    min="0"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="abrangencia" className="text-sm">Abrangência</label>
                  <select
                    id="abrangencia"
                    {...noticiaForm.register("abrangencia")}
                    className="bg-[#121212] border border-white/20 rounded p-2 text-white"
                  >
                    <option value="">Selecione a abrangência</option>
                    <option value="Nacional">Nacional</option>
                    <option value="Regional">Regional</option>
                    <option value="Local">Local</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="prioridade" className="text-sm">Prioridade</label>
                  <select
                    id="prioridade"
                    {...noticiaForm.register("prioridade")}
                    className="bg-[#121212] border border-white/20 rounded p-2 text-white"
                  >
                    <option value="">Selecione a prioridade</option>
                    <option value="Alta">Alta</option>
                    <option value="Média">Média</option>
                    <option value="Baixa">Baixa</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="estrategica" className="text-sm">Estratégica</label>
                  <select
                    id="estrategica"
                    {...noticiaForm.register("estrategica")}
                    className="bg-[#121212] border border-white/20 rounded p-2 text-white"
                  >
                    <option value="">Selecione</option>
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                  </select>
                </div>

                <div className="text-right">
                  <button
                    type="submit"
                    disabled={!isNoticiaFormValid}
                    className={`flex items-center gap-2 px-4 py-2 bg-dark-card border border-white/10 rounded text-sm text-white hover:bg-[#f5a340]/20 hover:border-[#f5a340]/50 transition-all duration-300 ${
                      !isNoticiaFormValid ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <Save className="h-5 w-5 text-[#f5a340] hover:text-[#f5b86e] transition-colors" />
                    <span>Salvar Notícia</span>
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Adicionar Portal */}
          <Card className="bg-[#141414] border border-white/10 text-white">
            <CardHeader>
              <CardTitle className="text-xl text-white">Adicionar Portal</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={portalForm.handleSubmit(onPortalSubmit)} className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="nome" className="text-sm">Nome</label>
                  <input
                    type="text"
                    id="nome"
                    {...portalForm.register("nome")}
                    className="bg-[#121212] border border-white/20 rounded p-2 text-white"
                    placeholder="Nome do portal"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="data" className="text-sm">Data</label>
                  <Controller
                    name="data"
                    control={portalForm.control}
                    render={({ field }) => (
                      <DatePicker
                        onChange={(date) => field.onChange(date)}
                      />
                    )}
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="pontos" className="text-sm">Pontos</label>
                  <input
                    type="number"
                    id="pontos"
                    {...portalForm.register("pontos", { valueAsNumber: true })}
                    className="bg-[#121212] border border-white/20 rounded p-2 text-white"
                    placeholder="Pontuação"
                    min="0"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="abrangencia" className="text-sm">Abrangência</label>
                  <select
                    id="abrangencia"
                    {...portalForm.register("abrangencia")}
                    className="bg-[#121212] border border-white/20 rounded p-2 text-white"
                  >
                    <option value="">Selecione a abrangência</option>
                    <option value="Nacional">Nacional</option>
                    <option value="Regional">Regional</option>
                    <option value="Local">Local</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="prioridade" className="text-sm">Prioridade</label>
                  <select
                    id="prioridade"
                    {...portalForm.register("prioridade")}
                    className="bg-[#121212] border border-white/20 rounded p-2 text-white"
                  >
                    <option value="">Selecione a prioridade</option>
                    <option value="Alta">Alta</option>
                    <option value="Média">Média</option>
                    <option value="Baixa">Baixa</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="url" className="text-sm">URL</label>
                  <input
                    type="url"
                    id="url"
                    {...portalForm.register("url")}
                    className="bg-[#121212] border border-white/20 rounded p-2 text-white"
                    placeholder="https://"
                  />
                </div>

                <div className="text-right">
                  <button
                    type="submit"
                    disabled={!isPortalFormValid}
                    className={`flex items-center gap-2 px-4 py-2 bg-dark-card border border-white/10 rounded text-sm text-white hover:bg-[#f5a340]/20 hover:border-[#f5a340]/50 transition-all duration-300 ${
                      !isPortalFormValid ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <Save className="h-5 w-5 text-[#f5a340] hover:text-[#f5b86e] transition-colors" />
                    <span>Salvar Portal</span>
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Gerenciamento;