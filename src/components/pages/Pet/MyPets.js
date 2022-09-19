import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import ModalImages from '../../layout/ModalImages';
import { SiAddthis } from 'react-icons/si';
import { GiWeight, GiSandsOfTime } from 'react-icons/gi';
import {
  TbGenderMale,
  TbGenderFemale,
  TbGenderBigender,
  TbInfoCircle,
  TbMapPin,
  TbTrashX,
} from 'react-icons/tb';

/* css */
import styles from '../Home.module.scss';

/* hooks */
import useFlashMessage from '../../../hooks/useFlashMessage';

/* contexts */
import { Context } from '../../../context/UserContext';

function MyPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmationBox, setConfirmationBox] = useState([false, '']);
  const [token] = useState(localStorage.getItem('token') || '');
  const { setFlashMessage } = useFlashMessage();
  const { logout } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    if (token && loading) {
      window.scrollTo(0, 0);
      api
        .get('/pets/mypets', {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        })
        .then(response => {
          if (mounted) {
            setLoading(false);
            setPets(response.data.pets);
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
  }, [token, logout, loading]);

  async function removePet(id, action) {
    if (action === 'cancel') {
      setConfirmationBox([false, '']);
      return;
    }

    await api
      .delete(`/pets/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then(response => {
        const updatedPets = pets.filter(pet => pet._id !== id);
        setPets(updatedPets);
        setFlashMessage(response.data.message, 'success');
      })
      .catch(() => {
        setFlashMessage(
          'Houve um problema ao processar sua solicitação, tente novamente mais tarde!',
          'error',
        );
      });
    setConfirmationBox([false, '']);
  }

  function handleConfirmation(id) {
    setConfirmationBox([true, id]);
  }

  function sexSwitch(param) {
    switch (param) {
      case 'Macho':
        return <TbGenderMale />;
      case 'Fêmea':
        return <TbGenderFemale />;
      case 'Indefinido':
        return <TbGenderBigender />;
      default:
        return '';
    }
  }

  function handleButtonDetails(id) {
    if (token) {
      navigate(`/pet/${id}`);
    } else {
      setFlashMessage(
        'Faça login ou registre-se para ver detalhes do pet',
        'error',
      );
    }
  }

  return (
    <section>
      <h1>Meus Pets</h1>
      <SiAddthis
        onClick={() => navigate('/pet/add')}
        className={styles.svg_add}
      />
      {!loading && (
        <div className={styles.pet_container}>
          {pets.length > 0 ? (
            pets.map(pet => (
              <div className={styles.pet_card} key={pet._id}>
                <ModalImages
                  classname={'home'}
                  image={[pet.images[0], 0]}
                  pet={pet}
                />
                {confirmationBox[0] && confirmationBox[1] === pet._id ? (
                  <>
                    <h3
                      className={styles.h3_confirmation}
                    >{`Tem certeza que deseja excluir ${pet.name}?`}</h3>
                    <div
                      className={`${styles.div_buttons} ${styles.div_buttons_confirmation}`}
                    >
                      <button onClick={() => removePet(pet._id)}>Sim</button>
                      <button onClick={() => removePet(pet._id, 'cancel')}>
                        Cancelar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.title}>
                      <h3>{pet.name}</h3>
                      <button className={styles.remove}>
                        <TbTrashX onClick={() => handleConfirmation(pet._id)} />
                      </button>
                    </div>
                    <p>
                      <span>
                        <TbInfoCircle />
                      </span>
                      {` ${pet.type}, ${pet.specificType}`}
                    </p>
                    <p>
                      <span>{sexSwitch(pet.sex)}</span>
                      {` ${pet.sex}`}
                    </p>
                    <p>
                      <span>
                        <GiSandsOfTime />
                      </span>
                      {pet.years === 0
                        ? ''
                        : pet.years === 1
                        ? ` ${pet.years} ano`
                        : ` ${pet.years} anos`}
                      {pet.years > 0 && pet.months > 0 ? ' e ' : ''}
                      {pet.months === 0
                        ? ''
                        : pet.months === 1
                        ? ` ${pet.months} mês`
                        : ` ${pet.months} meses`}
                      {pet.months === 0 && pet.years === 0
                        ? ' A idade não foi informada'
                        : ''}
                    </p>
                    <p>
                      <span>
                        <GiWeight />
                      </span>
                      {pet.weightKg === 0
                        ? ''
                        : pet.weightKg === 1
                        ? ` ${pet.weightKg} quilo`
                        : ` ${pet.weightKg} quilos`}
                      {pet.weightKg > 0 && pet.weightG > 0 ? ' e ' : ''}
                      {pet.weightG === 0
                        ? ''
                        : pet.weightG === 1
                        ? ` ${pet.weightG} grama`
                        : ` ${pet.weightG} gramas`}
                      {pet.weightKg === 0 && pet.weightG === 0
                        ? ' O peso não foi informado'
                        : ''}
                    </p>
                    <p>
                      <span>
                        <TbMapPin />
                      </span>
                      {` ${pet.state},  ${pet.city}`}
                    </p>
                    <div className={styles.div_buttons}>
                      <button onClick={() => handleButtonDetails(pet._id)}>
                        Mais detalhes
                      </button>
                      <button onClick={() => navigate(`/pet/edit/${pet._id}`)}>
                        Editar
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <p>
              Não há pets cadastrados ou disponíveis para adoção no momento!
            </p>
          )}
        </div>
      )}
    </section>
  );
}

export default MyPets;
