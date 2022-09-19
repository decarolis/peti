import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../form/Input';

/* css */
import styles from '../../form/Form.module.scss';

/* contexts */
import { Context } from '../../../context/UserContext';

function Register() {
  const [user, setUser] = useState({});
  const { register } = useContext(Context);

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    register(user);
  }

  return (
    <section>
      <h1>Registrar</h1>
      <div className={styles.form_container_box}>
        <form onSubmit={handleSubmit} className={styles.form_container}>
          <Input
            text="Nome"
            type="text"
            name="name"
            placeholder="Digite seu nome"
            handleOnChange={handleChange}
          />
          <Input
            text="Telefone"
            type="text"
            name="phone"
            placeholder="Digite seu telefone"
            handleOnChange={handleChange}
          />
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
          <Input
            text="Confirmação de senha"
            type="password"
            name="confirmpassword"
            placeholder="Confirme sua senha"
            handleOnChange={handleChange}
          />
          <input type="submit" value="Cadastrar" />
          <p className={styles.p_link}>
            Já tem conta? <Link to="/login">Clique aqui.</Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Register;
