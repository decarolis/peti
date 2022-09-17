import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
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
  const [token] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const { setFlashMessage } = useFlashMessage();
  const { logout } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    if (token && loading) {
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

  async function removePet(id) {
    let msgType = 'success';

    const data = await api
      .delete(`/pets/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then(response => {
        const updatedPets = pets.filter(pet => pet._id !== id);
        setPets(updatedPets);
        return response.data;
      })
      .catch(err => {
        msgType = 'error';
        return err.response.data;
      });

    setFlashMessage(data.message, msgType);
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
                <div
                  style={{
                    backgroundImage: `url(${process.env.REACT_APP_API}/images/pets/${pet.images[0]})`,
                  }}
                  className={styles.pet_card_image}
                ></div>
                <div className={styles.title}>
                  <h3>{pet.name}</h3>
                  <button className={styles.remove}>
                    <TbTrashX onClick={() => removePet(pet._id)} />
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
