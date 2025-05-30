import React from 'react';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const PrivateRoute = ({ children }) => {
  const { toast } = useToast();
  const token = localStorage.getItem('token');

  if (!token) {
    toast({
      title: "Acesso negado",
      description: "Por favor, faça login para acessar esta página.",
      variant: "destructive",
    });
    return <Navigate to="/login" />;
  }

  // Verificar token com o backend (opcional, para maior segurança)
  const verifyToken = async () => {
    try {
      const response = await fetch('http://localhost:3001/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Token invalid');
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast({
        title: "Sessão expirada",
        description: "Por favor, faça login novamente.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  // Executar verificação assíncrona (usar useEffect ou uma abordagem mais robusta em produção)
  const isValid = token ? verifyToken() : false;

  return isValid ? children : <Navigate to="/login" />;
};

export default PrivateRoute;