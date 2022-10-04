import { NavLink } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import Logo from '../../assets/img/logo.png';
import { TiThMenu } from 'react-icons/ti';

/* css */
import styles from './Navbar.module.scss';

/* contexts */
import { Context } from '../../context/UserContext';
import api from '../../utils/api';

function Navbar() {
  const [menu, setMenu] = useState(false);
  const [userName, setUserName] = useState('');
  const [token] = useState(localStorage.getItem('token') || '');
  const { logout, authenticated } = useContext(Context);

  useEffect(() => {
    let mounted = true;
    if (authenticated && token) {
      api
        .get('/users/checkuser', {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        })
        .then(response => {
          if (mounted) {
            setUserName(response.data.name.split(' ')[0]);
          }
        })
        .catch(() => {
          return;
        });
    }
    return () => {
      mounted = false;
    };
  }, [token, authenticated]);

  return (
    <nav
      className={
        menu ? `${styles.navbar} ${styles.navbar_menu}` : `${styles.navbar}`
      }
      onClick={() => {
        if (menu) setMenu(false);
      }}
    >
      <div className={styles.navbar_logo}>
        <img src={Logo} alt="Petí" />
      </div>
      <div className={styles.ul_container}>
        <ul className={styles.main_ul}>
          <li>
            <NavLink to="/">Petí</NavLink>
          </li>
          <li>
            <NavLink to="/Adopt">Adotar Pet</NavLink>
          </li>

          {authenticated ? (
            <li onClick={() => setMenu(!menu)}>{`Olá, ${userName}`}</li>
          ) : (
            <>
              <li>
                <NavLink to="/login">Entrar</NavLink>
              </li>
              <li>
                <NavLink to="/register">Registar</NavLink>
              </li>
            </>
          )}
        </ul>
        {authenticated ? (
          <>
            <ul className={styles.secondary_ul_colapse}>
              <li className={styles.menu} onClick={() => setMenu(!menu)}>
                <TiThMenu />
              </li>
            </ul>
            {!menu && (
              <ul className={styles.secondary_ul}>
                <li>
                  <NavLink to="/user/favorites">Meus Favoritos</NavLink>
                </li>
                <li>
                  <NavLink to="/pet/mypets">Meus Pets</NavLink>
                </li>
                <li>
                  <NavLink to="/user/profile">Meu Perfil</NavLink>
                </li>
                <li onClick={() => logout()}>
                  <NavLink style={{ border: 'none' }} to="#">
                    Sair
                  </NavLink>
                </li>
              </ul>
            )}
          </>
        ) : (
          ''
        )}
      </div>
      {menu && (
        <div className={styles.secondary_div_colapse}>
          {authenticated ? (
            <ul className={styles.secondary_ul}>
              <li>
                <NavLink to="/user/favorites">Meus Favoritos</NavLink>
              </li>
              <li>
                <NavLink to="/pet/mypets">Meus Pets</NavLink>
              </li>
              <li>
                <NavLink to="/user/profile">Meu Perfil</NavLink>
              </li>
              <li onClick={() => logout()}>
                <NavLink style={{ border: 'none' }} to="#">
                  Sair
                </NavLink>
              </li>
            </ul>
          ) : (
            <ul className={styles.secondary_ul}>
              <li>
                <NavLink to="/login">Entrar</NavLink>
              </li>
              <li>
                <NavLink to="/register">Registar</NavLink>
              </li>
            </ul>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
