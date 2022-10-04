import api from '../utils/api';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFlashMessage from './useFlashMessage';

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    let mounted = true;

    const token = localStorage.getItem('token');

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      api
        .get('/users/checkuser', {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        })
        .then(response => {
          if (mounted) {
            setAuthenticated(true);
            setUserName(response.data.name.split(' ')[0]);
          }
        })
        .catch(() => {
          return;
        });
    }
    if (mounted) {
      setLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, []);

  async function login(user) {
    try {
      const data = await api.post('/users/login', user).then(response => {
        return response.data;
      });

      await authUser(data);
      setFlashMessage('Login realizado com sucesso!', 'success');
      return ['', 'success'];
    } catch (error) {
      if (error.response.status === 401) {
        return [error.response.data.message, 'success'];
      } else {
        return [error.response.data.message, 'error'];
      }
    }
  }

  async function authUser(data) {
    console.log(data);
    localStorage.setItem('token', JSON.stringify(data.token));
    setUserName(data.userName.split(' ')[0]);
    setAuthenticated(true);

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

  return { authenticated, loading, login, logout, userName };
}
