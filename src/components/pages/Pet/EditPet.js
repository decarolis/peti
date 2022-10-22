import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import PetForm from '../../form/PetForm';
import ReactGA from 'react-ga';

/* hooks */
import useFlashMessage from '../../../hooks/useFlashMessage';

/* contexts */
import { Context } from '../../../context/UserContext';

/* css */
import stylesLoader from '../../layout/Loader.module.scss';

function EditPet() {
  const [pet, setPet] = useState({});
  const [loading, setLoading] = useState(true);
  const [submiting, setSubmiting] = useState(false);
  const [token] = useState(localStorage.getItem('token') || '');
  const { id } = useParams();
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();
  const { logout } = useContext(Context);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, []);

  const helpState = tempPet => {
    setPet(tempPet);
    setLoading(false);
  };

  useEffect(() => {
    let tempPet;
    let mounted = true;
    if (token && loading) {
      api
        .get(`/pets/${id}`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        })
        .then(response => {
          if (response.data.isOwner) {
            if (mounted) {
              tempPet = response.data.pet;
              helpState(tempPet);
            }
          } else {
            if (mounted) {
              navigate('/pet/mypets');
            }
          }
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
  }, [token, id, navigate, logout, loading]);

  async function updatePet(pet) {
    setSubmiting(true);
    let msgType = 'success';

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
      .patch(`pets/${pet._id}`, formData, {
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
      <h1>Editar informações de: {pet.name}</h1>
      {!loading && !submiting ? (
        <PetForm
          handleSubmit={updatePet}
          petData={pet}
          petPosition={pet.latLong}
          btnText="Salvar"
        />
      ) : (
        <div className={stylesLoader.loader}></div>
      )}
    </section>
  );
}

export default EditPet;
