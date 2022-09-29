import { NavLink } from 'react-router-dom';
import { useContext, useState } from 'react';
import Logo from '../../assets/img/logo.png';
import { TiThMenu } from 'react-icons/ti';

/* css */
import styles from './Navbar.module.scss';

/* contexts */
import { Context } from '../../context/UserContext';

function Navbar() {
  const [menu, setMenu] = useState(false);
  const { authenticated, logout } = useContext(Context);

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
        <div>
          <ul className={styles.main_ul}>
            <li>
              <NavLink to="/">Petí</NavLink>
            </li>
            <li>
              <NavLink to="/Adopt">Adotar Pet</NavLink>
            </li>
          </ul>
        </div>

        <div>
          <ul className={styles.secondary_ul_colapse}>
            <li className={styles.menu} onClick={() => setMenu(!menu)}>
              <TiThMenu />
            </li>
          </ul>
          {!menu && (
            <>
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
            </>
          )}
        </div>
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
