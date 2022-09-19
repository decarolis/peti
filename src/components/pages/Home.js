import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ModalImages from '../layout/ModalImages';
import { BsSuitHeart, BsFillSuitHeartFill } from 'react-icons/bs';
import { GiWeight, GiSandsOfTime } from 'react-icons/gi';
import {
  TbGenderMale,
  TbGenderFemale,
  TbGenderBigender,
  TbInfoCircle,
  TbMapPin,
} from 'react-icons/tb';

/* css*/
import styles from './Home.module.scss';

/* hooks */
import useFlashMessage from '../../hooks/useFlashMessage';

function Home() {
  const [pets, setPets] = useState([]);
  const [token] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();

  const helpState = (tempPets, tempFavorites = []) => {
    setLoading(false);
    setPets(tempPets);
    setFavorites(tempFavorites);
  };

  useEffect(() => {
    let tempPets, tempFavorites;
    let mounted = true;
    if (token && loading) {
      api
        .get('pets')
        .then(response => {
          tempPets = response.data.pets;
        })
        .then(() => {
          api
            .get('/users/favorites', {
              headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
              },
            })
            .then(response => {
              const fav = [];
              for (let i = 0; i < response.data.pets.length; i++) {
                fav.push(response.data.pets[i]._id);
              }
              tempFavorites = fav;
              if (mounted) {
                helpState(tempPets, tempFavorites);
              }
            });
        })
        .catch(() => {
          if (mounted) {
            setFlashMessage(
              'Houve um problema ao processar sua solicitação, tente novamente mais tarde!',
              'error',
            );
          }
        });
    } else if (!token && loading) {
      api
        .get('pets')
        .then(response => {
          if (mounted) {
            tempPets = response.data.pets;
            helpState(tempPets);
          }
        })
        .catch(() => {
          if (mounted) {
            setFlashMessage(
              'Houve um problema ao processar sua solicitação, tente novamente mais tarde!',
              'error',
            );
          }
        });
    }
    return () => {
      mounted = false;
    };
  }, [setFlashMessage, token, loading]);

  async function handleFavorites(id, action) {
    if (token) {
      await api
        .patch(
          `/users/favorites/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(token)}`,
            },
          },
        )
        .then(response => {
          let updatedFavorites = [];
          if (action === 'remove') {
            updatedFavorites = favorites.filter(item => item !== id);
          } else if (action === 'add') {
            updatedFavorites = [...favorites, id];
          }
          setFavorites(updatedFavorites);
          setFlashMessage(response.data.message, 'success');
        })
        .catch(err => {
          setFlashMessage(err.response.data.message.toString(), 'error');
        });
    } else {
      setFlashMessage(
        'Faça login ou registre-se para adicionar aos favoritos',
        'error',
      );
    }
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
      <h1>Adote um Pet</h1>
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
                <div className={styles.title}>
                  <h3>{pet.name}</h3>
                  {favorites.includes(pet._id) ? (
                    <BsFillSuitHeartFill
                      onClick={() => handleFavorites(pet._id, 'remove')}
                      className={styles.red_heart}
                    />
                  ) : (
                    <BsSuitHeart
                      onClick={() => handleFavorites(pet._id, 'add')}
                      className={styles.heart}
                    />
                  )}
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
                <button
                  className={styles.button_home}
                  onClick={() => handleButtonDetails(pet._id)}
                >
                  Mais detalhes
                </button>
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

export default Home;
