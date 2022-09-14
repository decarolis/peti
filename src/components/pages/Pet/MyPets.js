import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../utils/api';
import RoundedImage from '../../layout/RoundedImage';

/* css */
import styles from './Dashboard.module.scss';

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

  return (
    <>
      {!loading && (
        <section>
          <div className={styles.petslist_header}>
            <h1>Meus Pets Cadastrados</h1>
            <Link to="/pet/add">Cadastrar Pet</Link>
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
                        <Link to={`/pet/edit/${pet._id}`}>Editar</Link>
                        <button
                          onClick={() => {
                            removePet(pet._id);
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
              <p>Ainda não há pets cadastrados!</p>
            )}
          </div>
        </section>
      )}
    </>
  );
}

export default MyPets;
