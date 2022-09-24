import api from '../utils/api';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFlashMessage from './useFlashMessage';

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    let mounted = true;

    const token = localStorage.getItem('token');

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      if (mounted) {
        setAuthenticated(true);
      }
    }
    if (mounted) {
      setLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, []);

  async function login(user) {
    let msgText = 'Login realizado com sucesso!';
    let msgType = 'success';

    try {
      const data = await api.post('/users/login', user).then(response => {
        return response.data;
      });

      await authUser(data);
    } catch (error) {
      // tratar erro
      msgText = error.response.data.message;
      msgType = 'error';
    }

    setFlashMessage(msgText, msgType);
    return;
  }

  async function authUser(data) {
    setAuthenticated(true);
    localStorage.setItem('token', JSON.stringify(data.token));

    navigate('/');
  }

  function logout(
    msgText = 'Logout realizado com sucesso!',
    msgType = 'success',
  ) {
    setAuthenticated(false);
    localStorage.removeItem('token');
    api.defaults.headers.Authorization = undefined;
    navigate('/login');

    setFlashMessage(msgText, msgType);
  }

  return { authenticated, loading, login, logout };
}
