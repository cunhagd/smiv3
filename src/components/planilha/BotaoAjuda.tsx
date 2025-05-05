import React, { useState } from 'react';
import { CircleHelp, Smile, Frown, Meh, CircleCheckBig, Trash2, Lightbulb, Star, ExternalLink, CircleArrowLeft } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

const BotaoAjuda: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const iconesLegenda = [
    { icone: CircleCheckBig, nome: 'Utilidade: Útil', descricao: 'Marca a notícia como útil.', cor: '#fa6bfa' },
    { icone: Trash2, nome: 'Utilidade: Lixo', descricao: 'Marca a notícia como lixo / Abre a Lixeira.', cor: '#f5a340' },
    { icone: Lightbulb, nome: 'Utlidade: Suporte', descricao: 'Marca a notícia como suporte / Abre a aba de Suporte.', cor: 'blue-400' },
    { icone: Smile, nome: 'Avaliação: Positiva', descricao: 'Indica que a notícia tem uma avaliação positiva.', cor: 'green-600' },
    { icone: Meh, nome: 'Avaliação: Neutra', descricao: 'Indica que a notícia tem uma avaliação neutra.', cor: 'gray-600' },
    { icone: Frown, nome: 'Avaliação: Negativa', descricao: 'Indica que a notícia tem uma avaliação negativa.', cor: 'red-600' },
    { icone: Star, nome: 'Notícias Estratégicas', descricao: 'Marca a notícia como estratégica / Ativa o filtro de notícias estratégicas.', cor: 'yellow-300' },
    { icone: CircleArrowLeft, nome: 'Voltar à planilha', descricao: 'Sair da aba atual e voltar à planilha principal com todas notícias.', cor: 'white' },
    { icone: ExternalLink, nome: 'Acessar notícia', descricao: 'Abre o link da notícia em uma nova aba.', cor: 'blue-400' },
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
              {iconesLegenda.map(({ icone: Icone, nome, descricao, cor }) => (
                <div key={nome} className="flex items-center gap-3">
                  <Icone
                    className={`h-5 w-5 ${
                      nome === 'Utilidade: Útil' || nome === 'Utilidade: Lixo'
                        ? ''
                        : `text-${cor} ${nome === 'Notícias Estratégicas' ? 'fill-yellow-300' : ''}`
                    }`}
                    style={
                      nome === 'Utilidade: Útil' || nome === 'Utilidade: Lixo'
                        ? { color: cor }
                        : undefined
                    }
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