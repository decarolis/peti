import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { BiSubdirectoryRight } from 'react-icons/bi';
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
import Map from '../../layout/Map';

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
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [token] = useState(localStorage.getItem('token') || '');
  const { setFlashMessage } = useFlashMessage();
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useContext(Context);

  const helpState = (tempMainImage, tempPet, tempFavorites) => {
    setReq(false);
    setFavorites(tempFavorites);
    setPet(tempPet);
    setMainImage(tempMainImage);
    setLoading(false);
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

  const handleNextImage = useCallback(
    signal => {
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
    },
    [mainImage, pet.images],
  );

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

  useEffect(() => {
    const listener = event => {
      if (event.key == 'ArrowLeft') handleNextImage('-');
      if (event.key == 'ArrowRight') handleNextImage('+');
    };
    if (mainImage.length > 0) {
      document.addEventListener('keydown', listener);
    }
    return () => document.removeEventListener('keydown', listener);
  }, [mainImage, handleNextImage]);

  return (
    <section>
      <IoMdArrowRoundBack
        onClick={() => navigate(-1)}
        className={styles.svg_add}
      />
      {!loading && (
        <>
          <h1>Olá, meu nome é {pet.name} e preciso de um novo lar!</h1>
          <div className={styles.pet_details_container}>
            <div className={styles.pet_images_container}>
              <div className={styles.pet_image}>
                <img
                  className={`${
                    mainImage[1] % 2 === 0
                      ? styles.pet_image_tag_0
                      : styles.pet_image_tag_1
                  }`}
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
              <div className={styles.pet_details_info}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <h2>{pet.name}</h2>
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
                <div className={styles.pet_details_bio}>
                  <p>{pet.bio}</p>
                </div>
                <div style={{ display: 'flex' }}>
                  <span>
                    <TbInfoCircle />
                  </span>
                  <p>{` ${pet.type}, ${pet.specificType}`}</p>
                </div>
                <div style={{ display: 'flex' }}>
                  <p>
                    <span>{sexSwitch(pet.sex)}</span>
                    {` ${pet.sex}`}
                  </p>
                </div>
                <div style={{ display: 'flex' }}>
                  <span>
                    <GiSandsOfTime />
                  </span>
                  <p>
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
                </div>
                <div style={{ display: 'flex' }}>
                  <span>
                    <GiWeight />
                  </span>
                  <p>
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
                </div>
                <div style={{ display: 'flex' }}>
                  <span>
                    <TbMapPin />
                  </span>
                  <p>{` ${pet.state},  ${pet.city}`}</p>
                </div>
                <div style={{ display: 'flex' }}>
                  <span>
                    <BiSubdirectoryRight />
                  </span>
                  <p>{` ${pet.district} `}</p>
                </div>
              </div>
              <div className={styles.pet_details_map}>
                <Map position={pet.latLong} zoom={13} />
              </div>
              <div className={styles.pet_details_contact}>
                <p>Para saber mais detalhes entre em contato com:</p>
                <h4>{pet.user.name}</h4>
                <h4>{pet.user.phone}</h4>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default PetDetails;
