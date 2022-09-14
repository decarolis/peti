import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import { BsSuitHeart, BsFillSuitHeartFill } from 'react-icons/bs';
import { GiWeight, GiSandsOfTime } from 'react-icons/gi';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import {
  TbGenderMale,
  TbGenderFemale,
  TbGenderBigender,
  TbInfoCircle,
  TbMapPin,
} from 'react-icons/tb';

/* css */
import styles from './PetDetails.module.scss';

/* hooks */
import useFlashMessage from '../../../hooks/useFlashMessage';

/* contexts */
import { Context } from '../../../context/UserContext';

function PetDetails() {
  const [pet, setPet] = useState({});
  const [mainImage, setMainImage] = useState([]);
  const [req, setReq] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [token] = useState(localStorage.getItem('token') || '');
  const { setFlashMessage } = useFlashMessage();
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useContext(Context);

  const helpState = (tempMainImage, tempPet, tempFavorites) => {
    setReq(false);
    setMainImage(tempMainImage);
    setFavorites(tempFavorites);
    setPet(tempPet);
  };

  useEffect(() => {
    let tempMainImage, tempPet, tempFavorites;
    let mounted = true;
    if (token && req) {
      api
        .get('/users/checkuser', {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        })
        .then(response => {
          tempFavorites = response.data.favorites;
        })
        .then(() => {
          api
            .get(`/pets/${id}`, {
              headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
              },
            })
            .then(response => {
              tempPet = response.data.pet;
              tempMainImage = [response.data.pet.images[0], 0];
              if (mounted) {
                helpState(tempMainImage, tempPet, tempFavorites);
              }
            });
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
  }, [navigate, logout, token, req, id]);

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
        .then(() => {
          let updatedFavorites = [];
          if (action === 'remove') {
            updatedFavorites = favorites.filter(item => item !== id);
          } else if (action === 'add') {
            updatedFavorites = [...favorites, id];
          }
          setFavorites(updatedFavorites);
        })
        .catch(err => {
          const msgType = 'error';
          setFlashMessage(err.response.data.message, msgType);
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

  function handleMainImage(image, index) {
    setMainImage([image, index]);
  }

  function handleNextImage(signal) {
    if (signal === '+' && mainImage[1] === pet.images.length - 1) {
      return;
    } else if (signal === '+') {
      setMainImage([pet.images[mainImage[1] + 1], mainImage[1] + 1]);
    }
    if (signal === '-' && mainImage[1] === 0) {
      return;
    } else if (signal === '-') {
      setMainImage([pet.images[mainImage[1] - 1], mainImage[1] - 1]);
    }
  }

  function disableButton(index, signal) {
    if (signal === '+' && index === pet.images.length - 1) {
      return styles.disable_button;
    } else if (signal === '-' && index === 0) {
      return styles.disable_button;
    } else {
      return '';
    }
  }

  function handleImageList(img, index) {
    if (img === mainImage[0] && index === mainImage[1]) {
      return styles.image_list;
    } else {
      return '';
    }
  }

  return (
    <section>
      {pet.name && (
        <>
          <h1>Olá, meu nome é {pet.name} e preciso de um novo lar!</h1>
          <div className={styles.pet_details_container}>
            <div className={styles.pet_images_container}>
              <div className={styles.pet_image}>
                <img
                  src={`${process.env.REACT_APP_API}/images/pets/${mainImage[0]}`}
                  alt={pet.name}
                />
              </div>
              <div className={styles.pet_images}>
                {pet.images.map((image, index) => (
                  <img
                    onClick={() => handleMainImage(image, index)}
                    key={index}
                    src={`${process.env.REACT_APP_API}/images/pets/${image}`}
                    alt={pet.name}
                    className={handleImageList(image, index)}
                  />
                ))}
              </div>
              <div
                onClick={() => handleNextImage('-')}
                className={`${styles.arrow_left} ${
                  styles.arrow
                } ${disableButton(mainImage[1], '-')}`}
              >
                <FaArrowLeft />
              </div>
              <div
                onClick={() => handleNextImage('+')}
                className={`${styles.arrow_right} ${
                  styles.arrow
                } ${disableButton(mainImage[1], '+')}`}
              >
                <FaArrowRight />
              </div>
            </div>
            <div className={styles.pet_details}>
              <h3>{pet.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
              </p>
              <p>
                <span>
                  <GiWeight />
                </span>
                {` ${pet.weight} `}kg
              </p>
              <p>
                <span>
                  <TbMapPin />
                </span>
                {` ${pet.state},  ${pet.city}`}
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default PetDetails;
