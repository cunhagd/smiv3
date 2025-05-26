import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus, CircleArrowLeft, Turtle, HousePlus, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import axios from "axios";
import PortaisCadastrados from "@/components/gerenciamento/PortaisCadastrados";
import FiltroPortalCadastrado from "@/components/gerenciamento/FiltroPortalCadastrado";
import AdicionarNoticia from "@/components/gerenciamento/AdicionarNoticia";
import AdicionarPortal from "@/components/gerenciamento/AdicionarPortal";

interface Portal {
  nome: string;
  pontos: number;
  abrangencia: string;
  prioridade: string;
  url: string;
}

interface FilterState {
  nome: string;
  pontos: string;
  abrangencia: string;
  prioridade: string;
  url: string;
}

const API_BASE_URL = "https://smi-api-production-fae2.up.railway.app";
const ADMIN_PASSWORD = "admin123"; // Senha hardcoded (alterar conforme necessário)

const Gerenciamento = () => {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [portais, setPortais] = useState<Portal[]>([]);
  const [filteredPortais, setFilteredPortais] = useState<Portal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingPortais, setIsLoadingPortais] = useState(false);
  const [errorPortais, setErrorPortais] = useState<string | null>(null);
  const [showNoticiaForm, setShowNoticiaForm] = useState(false);
  const [showPortalForm, setShowPortalForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(null);
      setPassword("");
    } else {
      setPasswordError("Senha incorreta. Tente novamente.");
    }
  };

  // Buscar lista de portais
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchPortais = async () => {
      setIsLoadingPortais(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/portais/cadastrados`);
        const portaisArray: Portal[] = Object.entries(response.data).map(([nome, dados]: [string, any]) => ({
          nome,
          pontos: dados.pontos,
          abrangencia: dados.abrangencia,
          prioridade: dados.prioridade,
          url: dados.url,
        }));
        setPortais(portaisArray);
        setFilteredPortais(portaisArray);
      } catch (err) {
        setErrorPortais("Erro ao carregar portais.");
        console.error(err);
      } finally {
        setIsLoadingPortais(false);
      }
    };
    fetchPortais();
  }, [isAuthenticated]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleFilterChange = (filters: FilterState) => {
    const filtered = portais.filter((portal) => {
      const matchesNome = filters.nome
        ? portal.nome.toLowerCase().includes(filters.nome.toLowerCase())
        : true;
      const matchesPontos = filters.pontos
        ? portal.pontos === parseInt(filters.pontos)
        : true;
      const matchesAbrangencia = filters.abrangencia
        ? portal.abrangencia === filters.abrangencia
        : true;
      const matchesPrioridade = filters.prioridade
        ? portal.prioridade === filters.prioridade
        : true;
      const matchesUrl = filters.url
        ? portal.url.toLowerCase().includes(filters.url.toLowerCase())
        : true;
      return matchesNome && matchesPontos && matchesAbrangencia && matchesPrioridade && matchesUrl;
    });
    setFilteredPortais(filtered);
  };

  const handleToggleNoticiaForm = () => {
    setShowNoticiaForm((prev) => !prev);
    setShowPortalForm(false); // Ensure only one form is shown
  };

  const handleTogglePortalForm = () => {
    setShowPortalForm((prev) => !prev);
    setShowNoticiaForm(false); // Ensure only one form is shown
  };

  const handlePortalSubmitSuccess = (newPortal: Portal) => {
    setPortais((prev) => [...prev, newPortal]);
    setFilteredPortais((prev) => [...prev, newPortal]);
    handleTogglePortalForm();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">
        <Card className="bg-[#141414] border border-white/10 w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-[#A50CE8]" />
              Acesso Restrito
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="password" className="text-sm font-medium text-white">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#121212] border border-white/20 rounded-lg p-3 text-white focus:border-[#A50CE8] focus:ring-1 focus:ring-[#A50CE8] transition-all"
                  placeholder="Digite a senha"
                />
                {passwordError && (
                  <p className="text-red-400 text-sm">{passwordError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-[#A50CE8] hover:bg-[#AD8AEB] text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Entrar
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar />
      <main className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Gerenciamento</h1>
            <p className="text-[#9ca3af]">
              {showNoticiaForm ? "Adicionar nova notícia" : showPortalForm ? "Adicionar novo portal" : "Gerencie notícias e portais com facilidade"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {showNoticiaForm ? (
              <span
                onClick={handleToggleNoticiaForm}
                className="cursor-pointer text-[#A50CE8] hover:text-[#AD8AEB] transition-colors"
                title="Voltar"
              >
                <CircleArrowLeft className="h-6 w-6" />
              </span>
            ) : showPortalForm ? (
              <span
                onClick={handleTogglePortalForm}
                className="cursor-pointer text-[#ED155A] hover:text-[#F0A1BA] transition-colors"
                title="Voltar"
              >
                <CircleArrowLeft className="h-6 w-6" />
              </span>
            ) : (
              <>
                <span
                  onClick={handleToggleNoticiaForm}
                  className="cursor-pointer text-[#A50CE8] hover:text-[#AD8AEB] transition-colors"
                  title="Adicionar Notícia"
                >
                  <FilePlus className="h-6 w-6" />
                </span>
                <span
                  onClick={handleTogglePortalForm}
                  className="cursor-pointer text-[#ED155A] hover:text-[#F0A1BA] transition-colors"
                  title="Adicionar Portal"
                >
                  <HousePlus className="h-6 w-6" />
                </span>
                {isLoadingPortais ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <Turtle className="w-8 h-8 text-[#CAF10A] animate-spin" />
                  </div>
                ) : errorPortais ? (
                  <div className="text-red-400">{errorPortais}</div>
                ) : (
                  <FiltroPortalCadastrado
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    onClear={handleClearSearch}
                    portais={portais}
                    onFilterChange={handleFilterChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {showNoticiaForm ? (
          <AdicionarNoticia
            setMessage={setMessage}
            onSubmitSuccess={handleToggleNoticiaForm}
            onCancel={handleToggleNoticiaForm}
          />
        ) : showPortalForm ? (
          <AdicionarPortal
            setMessage={setMessage}
            onSubmitSuccess={handlePortalSubmitSuccess}
            onCancel={handleTogglePortalForm}
          />
        ) : (
          <div className="space-y-10">
            {/* Portais Cadastrados */}
            <PortaisCadastrados
              portais={filteredPortais}
              setPortais={setPortais}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              onClear={handleClearSearch}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Gerenciamento;