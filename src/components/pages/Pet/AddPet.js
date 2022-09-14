import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import PetForm from '../../form/PetForm';

/* css */
import styles from './AddPet.module.scss';

/* hooks */
import useFlashMessage from '../../../hooks/useFlashMessage';

function AddPet() {
  const [token] = useState(localStorage.getItem('token') || '');
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();

  async function registerPet(pet) {
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

    setFlashMessage(data.message, msgType);
    if (msgType === 'success') {
      navigate('/pet/mypets');
    }
  }

  return (
    <section>
      <div className={styles.addpet_header}>
        <h1>Cadastre um Pet</h1>
        <p>Depois ele ficará disponível para adoção</p>
      </div>
      <PetForm handleSubmit={registerPet} btnText="Cadastrar" />
    </section>
  );
}

export default AddPet;
