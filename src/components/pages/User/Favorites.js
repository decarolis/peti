import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import RoundedImage from '../../layout/RoundedImage';

/* css */
import styles from '../Pet/Dashboard.module.scss';

/* hooks */
import useFlashMessage from '../../../hooks/useFlashMessage';

/* contexts */
import { Context } from '../../../context/UserContext';

function Favorites() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token] = useState(localStorage.getItem('token') || '');
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();
  const { logout } = useContext(Context);

  useEffect(() => {
    let mounted = true;
    if (token && loading) {
      api
        .get('/users/favorites', {
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
  }, [token, logout, navigate, loading]);

  async function disfavorPet(id) {
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
        const updatedPets = pets.filter(pet => pet._id !== id);
        setPets(updatedPets);
      })
      .catch(err => {
        const msgType = 'error';
        setFlashMessage(err.response.data.message, msgType);
      });
  }

  return (
    <>
      {!loading && (
        <section>
          <div className={styles.petslist_header}>
            <h1>Meus favoritos</h1>
          </div>
          <div className={styles.petslist_container}>
            {pets.length > 0 ? (
              pets.map(pet => (
                <div key={pet._id} className={styles.petlist_row}>
                  <RoundedImage
                    src={`${process.env.REACT_APP_API}/images/pets/${pet.images[0]}`}
                    alt={pet.name}
                    width="px75"
                  />
                  <span className="bold">{pet.name}</span>
                  <div className={styles.actions}>
                    {pet.active ? (
                      <>
                        <button
                          onClick={() => {
                            disfavorPet(pet._id);
                          }}
                        >
                          Excluir
                        </button>
                      </>
                    ) : (
                      <p>Pet já adotado</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>Ainda não há pets favoritos!</p>
            )}
          </div>
        </section>
      )}
    </>
  );
}

export default Favorites;
