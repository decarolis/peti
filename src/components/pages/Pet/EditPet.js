import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import PetForm from '../../form/PetForm';

/* css */
import styles from './AddPet.module.scss';

/* hooks */
import useFlashMessage from '../../../hooks/useFlashMessage';

/* contexts */
import { Context } from '../../../context/UserContext';

function EditPet() {
  const [pet, setPet] = useState({});
  const [loading, setLoading] = useState(true);
  const [token] = useState(localStorage.getItem('token') || '');
  const { id } = useParams();
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();
  const { logout, authenticated } = useContext(Context);

  console.log(authenticated);

  const helpState = tempPet => {
    setPet(tempPet);
    setLoading(false);
  };

  useEffect(() => {
    console.log('oi effect');
    let tempPet;
    let mounted = true;
    if (token && loading) {
      console.log('oi effect REQ');
      api
        .get(`/pets/${id}`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        })
        .then(response => {
          console.log(response.data);
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
        console.log(err);
        msgType = 'error';
        return err.response.data;
      });

    setFlashMessage(data.message, msgType);
    if (msgType === 'success') {
      navigate('/pet/mypets');
    }
  }

  return (
    <section>
      <div className={styles.addpet_header}>
        <h1>Editando o Pet: {pet.name}</h1>
        <p>Depois da edição os dados serão atualizados no sistema</p>
      </div>
      {!loading && (
        <PetForm
          handleSubmit={updatePet}
          petData={pet}
          petPosition={pet.latLong}
          btnText="Editar"
        />
      )}
    </section>
  );
}

export default EditPet;
