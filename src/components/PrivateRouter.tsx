import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Definir a URL da API como a URL do Railway
const API_BASE_URL = 'https://api-auth-service.up.railway.app';

const PrivateRoute = ({ children }) => {
  const { toast } = useToast();
  const location = useLocation();
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Token inválido ou expirado');
        }

        setIsValid(true);
      } catch (error) {
        console.error('Erro na validação do token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast({
          title: 'Sessão expirada',
          description: 'Por favor, faça login novamente.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [toast]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return isValid ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;