import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BsSuitHeart, BsFillSuitHeartFill } from 'react-icons/bs';
import { GiWeight, GiSandsOfTime } from 'react-icons/gi';
import {
  TbChevronRight,
  TbChevronDown,
  TbGenderMale,
  TbGenderFemale,
  TbGenderBigender,
  TbInfoCircle,
  TbMapPin,
} from 'react-icons/tb';

/* pages */
import ModalImages from '../layout/ModalImages';
import PetForm from '../form/PetForm';

/* css */
import styles from './Adopt.module.scss';
import stylesLoader from '../layout/Loader.module.scss';

/* hooks */
import useFlashMessage from '../../hooks/useFlashMessage';

function Home() {
  const [token] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [obj, setObj] = useState({
    pets: [],
    page: 1,
    search: '',
    sort: -1,
    minAge: 0,
    maxAge: 0,
    minWeight: 0,
    maxWeight: 0,
    sex: '',
    type: '',
    location: '',
  });
  const [filter, setFilter] = useState(false);
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      entries => {
        if (
          entries.some(entry => entry.isIntersecting) &&
          entries[0].isVisible &&
          obj.pets.length !== obj.total &&
          obj.pets.length !== 0 &&
          !loading
        ) {
          setObj(prev => ({ ...prev, page: prev.page + 1 }));
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0,

        /* required options*/
        trackVisibility: true,
        delay: 100, // minimum 100
      },
    );
    intersectionObserver.observe(document.querySelector('#sentinela'));
    return () => intersectionObserver.disconnect();
  }, [obj.total, obj.pets.length]);

  useEffect(() => {
    let mounted = true;
    if (token) {
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
          if (mounted) {
            setFavorites(fav);
          }
        });
    }
    return () => {
      mounted = false;
    };
  }, [token]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setLoading(true);
      if (obj.page === 1) {
        setObj(prev => ({
          ...prev,
          pets: [],
        }));
      }
    }
    const url = `pets?page=${obj.page}&sort=${obj.sort}&search=${obj.search}&minAge=${obj.minAge}&maxAge=${obj.maxAge}&minWeight=${obj.minWeight}&maxWeight=${obj.maxWeight}&sex=${obj.sex}&location=${obj.location}&type=${obj.type}`;
    api.get(url).then(response => {
      if (mounted) {
        setObj(prev => ({
          ...prev,
          pets: [...prev.pets, ...response.data.pets],
          total: response.data.total,
        }));
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [
    obj.page,
    obj.sort,
    obj.search,
    obj.minAge,
    obj.maxAge,
    obj.minWeight,
    obj.maxWeight,
    obj.sex,
    obj.location,
    obj.type,
  ]);

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
    // if (token) {
    navigate(`/pet/${id}`);
    // } else {
    //   setFlashMessage(
    //     'Faça login ou registre-se para ver detalhes do pet',
    //     'error',
    //   );
    // }
  }

  function filterPet(pet) {
    let sort;
    if (pet.sort === 'Mais antigos primeiro') {
      sort = 1;
    } else {
      sort = -1;
    }
    setObj({
      ...obj,
      page: 1,
      search: pet.search || '',
      sort: sort,
      minAge: pet.minAge || 0,
      maxAge: pet.maxAge || 0,
      minWeight: pet.minWeight || 0,
      maxWeight: pet.maxWeight || 0,
      type: pet.type || '',
      location: pet.location || '',
      sex: pet.sex || '',
    });
  }

  return (
    <section>
      <h1>Adote um Pet</h1>
      <div className={styles.filter_container}>
        <div
          className={styles.filter_title}
          onClick={() => {
            setFilter(prev => !prev);
          }}
        >
          <p>
            Filtrar{' '}
            <span>{filter ? <TbChevronDown /> : <TbChevronRight />}</span>
          </p>
        </div>
        {filter && (
          <>
            <PetForm
              handleSubmit={filterPet}
              btnText="Filtrar"
              petFilterField={true}
            />
          </>
        )}
      </div>
      {obj.total ? (
        <div className={styles.pet_container}>
          {obj.total > 0 ? (
            obj.pets.map(pet => (
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
      ) : (
        ''
      )}
      {loading && <div className={stylesLoader.loader}></div>}
      <div
        style={
          obj.pets.length === obj.total
            ? { display: 'none', color: 'transparent' }
            : { display: 'block', color: 'transparent' }
        }
        id="sentinela"
      >
        Peti
      </div>
    </section>
  );
}

export default Home;
