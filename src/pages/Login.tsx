import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Definir a URL da API como a URL do Railway
const API_BASE_URL = 'smi-api-production-fae2.up.railway.app';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('HandleSubmit chamado');
    setLoading(true);

    try {
      console.log('API_BASE_URL:', API_BASE_URL); // Verifica o valor da URL
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('Resposta recebida:', response);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Login bem-sucedido, navegando para /dashboard');

      navigate('/dashboard');
      toast({
        title: 'Login realizado com sucesso',
        description: 'Bem-vindo ao Sistema de Monitoramento de Imprensa',
      });
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: 'Erro ao fazer login',
        description: error.message || 'Verifique suas credenciais e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      console.log('Fim do handleSubmit');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 p-6 md:p-12 flex items-center justify-center relative z-10">
        <div className="max-w-md w-full animate-fade-in">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-brand-yellow flex items-center justify-center">
              <span className="text-black font-bold text-xl">MG</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-4 gradient-text text-2xl font-bold">Governo de Minas Gerais</h1>
              <p className="text-gray-400">Sistema de Monitoramento de Imprensa</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-4 gradient-text text-3xl font-bold mb-2">Bem-vindo</h2>
          <p className="text-gray-400 mb-8">Entre com suas credenciais para acessar o sistema.</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-400 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@governo.mg.gov.br"
                className="form-input"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm text-gray-400 mb-1">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-dark-card checked:bg-brand-yellow checked:border-brand-yellow focus:ring-brand-yellow"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
                  Lembrar-me
                </label>
              </div>
              <a href="#" className="text-sm text-brand-blue hover:underline">
                Esqueceu a senha?
              </a>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-green-glow w-full flex items-center justify-center gap-2"
            >
              {loading ? 'Autenticando...' : 'Entrar'}
              {!loading && <ChevronRight className="h-4 w-4" />}
            </button>
          </form>
          
          <p className="mt-8 text-sm text-center text-gray-400">
            © 2025 Governo do Estado de Minas Gerais. Todos os direitos reservados.
          </p>
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden md:block md:w-1/2 bg-dark-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-transparent z-10"></div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20 animate-pulse-subtle">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="5" r="1" fill="rgba(202,241,10,0.5)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center p-10 z-20">
          <div className="glass-card p-6 max-w-lg">
            <div className="flex mb-4">
              <div className="h-10 w-10 rounded-full bg-brand-yellow flex items-center justify-center">
                <span className="text-black font-bold text-lg">MG</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4 gradient-text">Sistema de Monitoramento de Imprensa</h2>
            <p className="text-white/80 mb-6">
              Acompanhe, analise e gerencie as notícias sobre o Governo do Estado de Minas Gerais através da plataforma integrada de Monitoramento de Imprensa.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="px-3 py-1 bg-[#D4F437] rounded-full text-sm text-black">Análise de Dados</div>
              <div className="px-3 py-1 bg-[#D4F437] rounded-full text-sm text-black">Relatórios</div>
              <div className="px-3 py-1 bg-[#D4F437] rounded-full text-sm text-black">Calssificações</div>
              <div className="px-3 py-1 bg-[#D4F437] rounded-full text-sm text-black">Gestão de Notícias</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;