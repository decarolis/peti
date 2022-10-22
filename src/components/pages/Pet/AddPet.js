import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import PetForm from '../../form/PetForm';
import ReactGA from 'react-ga';

/* hooks */
import useFlashMessage from '../../../hooks/useFlashMessage';

/* contexts */
import { Context } from '../../../context/UserContext';

/* css */
import stylesLoader from '../../layout/Loader.module.scss';

function AddPet() {
  const [token] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const [submiting, setSubmiting] = useState(false);
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();
  const { logout } = useContext(Context);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, []);

  useEffect(() => {
    let mounted = true;
    if (token && loading) {
      api
        .get('/users/checkuser', {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        })
        .then(() => {
          setLoading(false);
        })
        .catch(() => {
          if (mounted) {
            logout(
              'Faça login ou registre-se para visitar esta página.',
              'error',
            );
          }
        });
    } else if (!token) {
      if (mounted) {
        logout('Faça login ou registre-se para visitar esta página.', 'error');
      }
    }
    return () => {
      mounted = false;
    };
  }, [navigate, logout, token, loading]);

  async function registerPet(pet) {
    setSubmiting(true);
    let msgType = 'success';

    if (!pet.years) {
      pet = { ...pet, years: 0 };
    }
    if (!pet.months) {
      pet = { ...pet, months: 0 };
    }
    if (!pet.weightKg) {
      pet = { ...pet, weightKg: 0 };
    }
    if (!pet.weightG) {
      pet = { ...pet, weightG: 0 };
    }

    const formData = new FormData();

    const petFormData = Object.keys(pet).forEach(key => {
      if (key === 'images') {
        for (let i = 0; i < pet[key].length; i++) {
          formData.append(`images`, pet[key][i]);
        }
      } else if (key === 'latLong') {
        for (let i = 0; i < pet[key].length; i++) {
          formData.append(`latLong`, pet[key][i]);
        }
      } else {
        formData.append(key, pet[key]);
      }
    });

    formData.append('pet', petFormData);

    const data = await api
      .post(`pets/create`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        return response.data;
      })
      .catch(err => {
        msgType = 'error';
        return err.response.data;
      });
    setSubmiting(false);
    setFlashMessage(data.message, msgType);
    if (msgType === 'success') {
      navigate('/pet/mypets');
    }
  }

  return (
    <section>
      <h1>Cadastre um Pet</h1>
      {!loading && !submiting ? (
        <PetForm handleSubmit={registerPet} btnText="Cadastrar" />
      ) : (
        <div className={stylesLoader.loader}></div>
      )}
    </section>
  );
}

export default AddPet;
