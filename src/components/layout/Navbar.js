import { Link } from 'react-router-dom';
import React, { useContext } from 'react';
import Logo from '../../assets/img/logo.png';

/* css */
import styles from './Navbar.module.scss';

/* contexts */
import { Context } from '../../context/UserContext';

function Navbar() {
  const { authenticated, logout } = useContext(Context);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_logo}>
        <img src={Logo} alt="Petí" />
      </div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {authenticated ? (
          <>
            <li>
              <Link to="/user/favorites">Meus Favoritos</Link>
            </li>
            <li>
              <Link to="/pet/mypets">Meus Pets</Link>
            </li>
            <li>
              <Link to="/user/profile">Meu Perfil</Link>
            </li>
            <li onClick={() => logout()}>
              <Link to="#">Sair</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Entrar</Link>
            </li>
            <li>
              <Link to="/register">Registar</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
