import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../form/Input';

/* css*/
import styles from '../../form/Form.module.scss';

/* contexts */
import { Context } from '../../../context/UserContext';

function Login() {
  const [user, setUser] = useState({});
  const { login } = useContext(Context);

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  const handleSubmit = e => {
    e.preventDefault();
    login(user);
  };

  return (
    <section>
      <h1>Login</h1>
      <div className={styles.form_container_box}>
        <form onSubmit={handleSubmit} className={styles.form_container}>
          <Input
            text="E-mail"
            type="email"
            name="email"
            placeholder="Digite seu e-mail"
            handleOnChange={handleChange}
          />
          <Input
            text="Senha"
            type="password"
            name="password"
            placeholder="Digite sua senha"
            handleOnChange={handleChange}
          />
          <input type="submit" value="Entrar" />
          <p className={styles.p_link}>
            Não tem conta? <Link to="/register">Clique aqui.</Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Login;
