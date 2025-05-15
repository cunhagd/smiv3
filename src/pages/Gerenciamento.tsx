
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "../components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Gerenciamento = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#121212]">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-white">Gerenciamento de Notícias e Portais</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Adicionar Notícia */}
          <Card className="bg-[#1A1F2C] border border-white/10 text-white">
            <CardHeader>
              <CardTitle className="text-xl text-white">Adicionar Notícia</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="titulo" className="text-sm">Título</label>
                  <input 
                    type="text" 
                    id="titulo" 
                    className="bg-[#121212] border border-white/20 rounded p-2 text-white"
                    placeholder="Título da notícia"
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="portal" className="text-sm">Portal</label>
                  <select 
                    id="portal" 
                    className="bg-[#121212] border border-white/20 rounded p-2 text-white"
                  >
                    <option value="">Selecione um portal</option>
                    <option value="g1">G1</option>
                    <option value="uol">UOL</option>
                    <option value="folha">Folha de São Paulo</option>
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="data" className="text-sm">Data</label>
                  <input 
                    type="date" 
                    id="data" 
                    className="bg-[#121212] border border-white/20 rounded p-2 text-white"
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="sentimento" className="text-sm">Sentimento</label>
                  <select 
                    id="sentimento" 
                    className="bg-[#121212] border border-white/20 rounded p-2 text-white"
                  >
                    <option value="">Selecione o sentimento</option>
                    <option value="positivo">Positivo</option>
                    <option value="negativo">Negativo</option>
                    <option value="neutro">Neutro</option>
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="link" className="text-sm">Link</label>
                  <input 
                    type="url" 
                    id="link" 
                    className="bg-[#121212] border border-white/20 rounded p-2 text-white"
                    placeholder="https://"
                  />
                </div>
                
                <div className="text-right">
                  <button 
                    type="submit" 
                    className="bg-brand-yellow text-black px-4 py-2 rounded font-medium hover:bg-yellow-500 transition-colors"
                  >
                    Adicionar Notícia
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Adicionar Portal */}
          <Card className="bg-[#1A1F2C] border border-white/10 text-white">
            <CardHeader>
              <CardTitle className="text-xl text-white">Adicionar Portal</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="nome-portal" className="text-sm">Nome do Portal</label>
                  <input 
                    type="text" 
                    id="nome-portal" 
                    className="bg-[#121212] border border-white/20 rounded p-2 text-white"
                    placeholder="Nome do portal"
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="url-portal" className="text-sm">URL</label>
                  <input 
                    type="url" 
                    id="url-portal" 
                    className="bg-[#121212] border border-white/20 rounded p-2 text-white"
                    placeholder="https://"
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="categoria" className="text-sm">Categoria</label>
                  <select 
                    id="categoria" 
                    className="bg-[#121212] border border-white/20 rounded p-2 text-white"
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="noticias">Notícias</option>
                    <option value="esportes">Esportes</option>
                    <option value="entretenimento">Entretenimento</option>
                    <option value="economia">Economia</option>
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="relevancia" className="text-sm">Relevância</label>
                  <select 
                    id="relevancia" 
                    className="bg-[#121212] border border-white/20 rounded p-2 text-white"
                  >
                    <option value="">Selecione a relevância</option>
                    <option value="alta">Alta</option>
                    <option value="media">Média</option>
                    <option value="baixa">Baixa</option>
                  </select>
                </div>
                
                <div className="text-right">
                  <button 
                    type="submit" 
                    className="bg-brand-yellow text-black px-4 py-2 rounded font-medium hover:bg-yellow-500 transition-colors"
                  >
                    Adicionar Portal
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Gerenciamento;
