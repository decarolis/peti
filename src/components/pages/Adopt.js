import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
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

/* css */
import styles from './Adopt.module.scss';
import stylesLoader from '../layout/Loader.module.scss';

/* hooks */
import useFlashMessage from '../../hooks/useFlashMessage';

function Home() {
  const [token] = useState(localStorage.getItem('token') || '');
  const [obj, setObj] = useState({ pets: [], page: 1, search: '', sort: -1 });
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(false);
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();

  console.log(obj);

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      entries => {
        if (
          entries.some(entry => entry.isIntersecting) &&
          entries[0].isVisible &&
          obj.pets.length !== obj.total &&
          obj.pets.length !== 0
        ) {
          console.log(entries[0].isVisible);
          console.log('to qui');
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
    const url = `pets?page=${obj.page}&sort=${obj.sort}&search=${obj.search}`;
    api.get(url).then(response => {
      if (mounted) {
        setObj(prev => ({
          ...prev,
          pets: [...prev.pets, ...response.data.pets],
          total: response.data.total,
        }));
      }
    });
    return () => {
      mounted = false;
    };
  }, [obj.page, obj.search, obj.sort]);

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

  function handleSearch(e) {
    setSearch(e.target.value);
  }

  function handleClickSearch() {
    if (search !== obj.search) {
      setObj({ ...obj, pets: [], page: 1, search: search });
    }
  }

  function handleSelect(e) {
    setObj({ ...obj, pets: [], page: 1, [e.target.name]: e.target.value });
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
            <div className={styles.filters}>
              <select name="sort" onChange={handleSelect}>
                <option value={-1}>Mais recentes primeiro</option>
                <option value={1}>Mais antigos primeiro</option>
              </select>
            </div>
            <div className={styles.search}>
              <input
                type="text"
                name="search"
                placeholder="Pesquisar"
                onChange={handleSearch}
              />
              <button onClick={handleClickSearch}>
                <FaSearch />
              </button>
            </div>
          </>
        )}
      </div>
      {obj.total ? (
        <>
          <div className={styles.pet_container}>
            {obj.pets.length > 0 ? (
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
        </>
      ) : (
        <div className={stylesLoader.loader}></div>
      )}
      <div
        style={
          obj.pets.length === obj.total
            ? { display: 'none' }
            : { display: 'block' }
        }
        id="sentinela"
      >
        oi
      </div>
    </section>
  );
}

export default Home;
