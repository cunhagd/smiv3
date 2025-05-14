import React, { useState } from 'react';
import { CircleHelp, Smile, Frown, Meh, CircleCheckBig, Trash2, Lightbulb, Sparkles, ExternalLink, CircleArrowLeft, SlidersHorizontal } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

const BotaoAjuda: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const iconesLegenda = [
    { icone: SlidersHorizontal, nome: 'Filtro Global', descricao: 'Ativa o filtro para as colunas da planilha.', cor: 'text-white', fill: false },
    { icone: CircleCheckBig, nome: 'Utilidade: Útil', descricao: 'Marca a notícia como útil / Abre notícias Úteis.', cor: 'text-[#fa6bfa]', fill: false },
    { icone: Trash2, nome: 'Utilidade: Lixo', descricao: 'Marca a notícia como lixo / Abre a Lixeira.', cor: 'text-[#f5a340]', fill: false },
    { icone: Lightbulb, nome: 'Utilidade: Suporte', descricao: 'Marca a notícia como suporte / Abre notícias de Suporte.', cor: 'text-blue-400', fill: false },
    { icone: Smile, nome: 'Avaliação: Positiva', descricao: 'Indica que a notícia tem uma avaliação positiva.', cor: 'text-[#34d399]', fill: false },
    { icone: Meh, nome: 'Avaliação: Neutra', descricao: 'Indica que a notícia tem uma avaliação neutra.', cor: 'text-[#9ca3af]', fill: false },
    { icone: Frown, nome: 'Avaliação: Negativa', descricao: 'Indica que a notícia tem uma avaliação negativa.', cor: 'text-[#f87171]', fill: false },
    { icone: Sparkles, nome: 'Notícias Estratégicas', descricao: 'Marca a notícia como estratégica / Ativa o filtro de notícias estratégicas.', cor: 'text-yellow-300', fill: true },
    { icone: CircleArrowLeft, nome: 'Voltar à planilha', descricao: 'Sair da aba atual e voltar à planilha principal com todas notícias.', cor: 'text-white', fill: false },
    { icone: ExternalLink, nome: 'Acessar notícia', descricao: 'Abre o link da notícia em uma nova aba.', cor: 'text-blue-400', fill: false },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-white hover:text-gray-300 transition-colors"
        aria-label="Ajuda - Ver legenda dos ícones"
      >
        <CircleHelp className="h-6 w-6" />
      </button>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
          <Dialog.Content
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dark-card border border-white/10 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] p-6 overflow-auto animate-modal-in focus:outline-none"
            aria-label="Legenda dos Ícones"
          >
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold text-white">
                Legenda dos Ícones
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Fechar modal de legenda"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Dialog.Close>
            </div>

            <div className="space-y-4">
              {iconesLegenda.map(({ icone: Icone, nome, descricao, cor, fill }) => (
                <div key={nome} className="flex items-center gap-3">
                  <Icone
                    className={`h-5 w-5 ${cor} ${fill ? 'fill-current' : ''}`}
                    stroke="currentColor"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">{nome}</p>
                    <p className="text-sm text-gray-300">{descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default BotaoAjuda;