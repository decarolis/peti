import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BsFillCheckCircleFill,
  BsFillExclamationCircleFill,
} from 'react-icons/bs';
import Input from '../../form/Input';
import api from '../../../utils/api';

/* css */
import styles from '../../form/Form.module.scss';
import messageStyles from '../../layout/Message.module.scss';
import stylesLoader from '../../layout/Loader.module.scss';

function Register() {
  const [user, setUser] = useState({});
  const [submiting, setSubmiting] = useState(false);
  const [validated, setValidated] = useState({});
  const [emailDenied, setEmailDenied] = useState([]);
  const [emailError, setEmailError] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState([]);

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
    if (e.target.name === 'name') {
      if (/(.*[a-z]){3}/i.test(e.target.value)) {
        setValidated({ ...validated, name: true });
      } else if (validated.name === true) {
        setValidated({ ...validated, name: false });
      }
    }
    if (e.target.name === 'email') {
      if (emailDenied.includes(e.target.value)) {
        setEmailError(true);
        setValidated({ ...validated, email: false });
        return;
      } else {
        setEmailError(false);
      }
      if (
        /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
          e.target.value,
        )
      ) {
        setValidated({ ...validated, email: true });
      } else if (validated.email === true) {
        setValidated({ ...validated, email: false });
      }
    }
    if (e.target.name === 'phone') {
      if (/(\D*\d){8}/.test(e.target.value)) {
        setValidated({ ...validated, phone: true });
      } else if (validated.phone === true) {
        setValidated({ ...validated, phone: false });
      }
    }
    if (e.target.name === 'password') {
      if (
        /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{8,}$/.test(e.target.value)
      ) {
        setValidated({ ...validated, password: true });
      } else if (validated.password === true) {
        setValidated({ ...validated, password: false });
      }
    }
    if (e.target.name === 'confirmpassword') {
      if (user.password && e.target.value === user.password) {
        setValidated({ ...validated, confirmpassword: true });
      } else if (validated.confirmpassword === true) {
        setValidated({ ...validated, confirmpassword: false });
      }
    }
  }

  function handleBlur(e) {
    if (e.target.name === 'name') {
      if (!/(.*[a-z]){3}/i.test(e.target.value)) {
        setValidated({ ...validated, name: false });
      }
    }
    if (e.target.name === 'email') {
      if (
        !/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
          e.target.value,
        )
      ) {
        setValidated({ ...validated, email: false });
      }
    }
    if (e.target.name === 'phone') {
      if (!/(\D*\d){8}/.test(e.target.value)) {
        setValidated({ ...validated, phone: false });
      }
    }
    if (e.target.name === 'password') {
      if (
        !/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{8,}$/.test(e.target.value)
      ) {
        setValidated({ ...validated, password: false });
      }
    }
    if (e.target.name === 'confirmpassword') {
      if (user.password && !(e.target.value === user.password)) {
        setValidated({ ...validated, confirmpassword: false });
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let obj = { ...validated };
    if (validated.name === undefined) {
      obj = { ...obj, name: false };
    }
    if (validated.email === undefined) {
      obj = { ...obj, email: false };
    }
    if (validated.phone === undefined) {
      obj = { ...obj, phone: false };
    }
    if (validated.password === undefined) {
      obj = { ...obj, password: false };
    }
    if (validated.confirmpassword === undefined) {
      obj = { ...obj, confirmpassword: false };
    }
    setValidated(obj);
    if (
      !validated.name ||
      !validated.email ||
      !validated.phone ||
      !validated.password ||
      !validated.confirmpassword
    ) {
      setError('* Preencha os campos solicitados');
      return;
    }
    setError('');
    setSubmiting(true);
    try {
      await api.post('/users/register', user).then(response => {
        setMessage([response.data.message, 'success']);
        setSubmiting(false);
      });
    } catch (error) {
      setMessage([error.response.data.message, 'error']);
      if (error.response.data.message === 'Email já cadastrado!') {
        setEmailDenied(prev => [...prev, user.email]);
        setEmailError(true);
        setValidated(prev => ({ ...prev, email: false }));
        setError('* Preencha os campos solicitados');
      }
      setSubmiting(false);
    }
  }

  return (
    <section>
      <h1>Registrar</h1>
      {submiting ? (
        <div className={stylesLoader.loader}></div>
      ) : message.length > 0 && message[1] === 'success' ? (
        <div className={messageStyles.message}>
          <div className={messageStyles.success}>
            <BsFillCheckCircleFill />
            <p>{message[0]}</p>
          </div>
        </div>
      ) : (
        <>
          {message.length > 0 && message[1] === 'error' ? (
            <div className={messageStyles.message}>
              <div className={messageStyles.error}>
                <BsFillExclamationCircleFill />
                <p>{message[0]}</p>
              </div>
            </div>
          ) : null}
          <div className={styles.form_container_box}>
            <form onSubmit={handleSubmit} className={styles.form_container}>
              <Input
                text="Nome"
                type="text"
                name="name"
                placeholder="Digite seu nome"
                handleOnChange={handleChange}
                handleOnBlur={handleBlur}
                value={user.name || ''}
                validatedClass={
                  validated.name === undefined
                    ? ''
                    : validated.name
                    ? 'success'
                    : 'error'
                }
                error="* Insira um nome válido"
              />
              <Input
                text="Telefone"
                type="text"
                name="phone"
                placeholder="Digite seu telefone"
                handleOnChange={handleChange}
                handleOnBlur={handleBlur}
                value={user.phone || ''}
                validatedClass={
                  validated.phone === undefined
                    ? ''
                    : validated.phone
                    ? 'success'
                    : 'error'
                }
                error="* Insira um telefone válido"
              />
              <Input
                text="E-mail"
                type="email"
                name="email"
                placeholder="Digite seu e-mail"
                handleOnChange={handleChange}
                handleOnBlur={handleBlur}
                value={user.email || ''}
                validatedClass={
                  validated.email === undefined
                    ? ''
                    : validated.email
                    ? 'success'
                    : 'error'
                }
                error={
                  emailError
                    ? '* Email já cadastrado!'
                    : '* Insira um email válido'
                }
              />
              <Input
                text="Senha"
                type="password"
                name="password"
                placeholder="Digite sua senha"
                handleOnChange={handleChange}
                handleOnBlur={handleBlur}
                value={user.password || ''}
                validatedClass={
                  validated.password === undefined
                    ? ''
                    : validated.password
                    ? 'success'
                    : 'error'
                }
                error={`* Sua senha precisa conter:\n   - Ao menos 8 caracteres\n   - Uma letra\n   - Um número`}
              />
              <Input
                text="Confirmação de senha"
                type="password"
                name="confirmpassword"
                placeholder="Confirme sua senha"
                handleOnChange={handleChange}
                handleOnBlur={handleBlur}
                value={user.confirmpassword || ''}
                validatedClass={
                  validated.confirmpassword === undefined
                    ? ''
                    : validated.confirmpassword
                    ? 'success'
                    : 'error'
                }
                error="* A confirmaçao de senha precisa ser igual a senha"
              />
              <input type="submit" value="Cadastrar" />
              {error && <p className={styles.p_error}>{error}</p>}
              <p className={styles.p_link}>
                Já tem conta? <Link to="/login">Clique aqui.</Link>
              </p>
            </form>
          </div>
        </>
      )}
    </section>
  );
}

export default Register;
