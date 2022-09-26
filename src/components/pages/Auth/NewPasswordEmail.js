import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BsFillExclamationCircleFill,
  BsFillCheckCircleFill,
} from 'react-icons/bs';
import api from '../../../utils/api';
import Input from '../../form/Input';

/* css*/
import styles from '../../form/Form.module.scss';
import messageStyles from '../../layout/Message.module.scss';
import stylesLoader from '../../layout/Loader.module.scss';

function NewPasswordEmail() {
  const [user, setUser] = useState({});
  const [validated, setValidated] = useState({});
  const [emailDenied, setEmailDenied] = useState([]);
  const [emailError, setEmailError] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState([]);
  const [submiting, setSubmiting] = useState(false);
  const [body, setBody] = useState(true);

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
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
  }

  function handleBlur(e) {
    if (e.target.name === 'email') {
      if (
        !/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
          e.target.value,
        )
      ) {
        setValidated({ ...validated, email: false });
      }
    }
  }

  const handleSubmit = async e => {
    e.preventDefault();
    let obj = { ...validated };
    if (validated.email === undefined) {
      obj = { ...obj, email: false };
    }
    setValidated(obj);
    if (!validated.email) {
      setError('* Preencha o campo solicitado');
      return;
    }
    setError('');
    setSubmiting(true);
    try {
      await api.post('/users/reset', user).then(response => {
        setBody(false);
        setMessage([response.data.message, 'success']);
      });
    } catch (error) {
      setMessage([error.response.data.message, 'error']);
      if (error.response.data.message === 'Email não cadastrado!') {
        setEmailDenied(prev => [...prev, user.email]);
        setEmailError(true);
        setValidated(prev => ({ ...prev, email: false }));
        setError('* Preencha os campos solicitados');
      }
      setSubmiting(false);
    }
    setSubmiting(false);
  };

  return (
    <section>
      <h1>Esqueceu a sua senha?</h1>
      {!submiting ? (
        <>
          {message.length > 0 && message[1] === 'error' ? (
            <div className={messageStyles.message}>
              <div className={messageStyles.error}>
                <BsFillExclamationCircleFill />
                <p>{message[0]}</p>
              </div>
            </div>
          ) : message.length > 0 && message[1] === 'success' ? (
            <div className={messageStyles.message}>
              <div className={messageStyles.success}>
                <BsFillCheckCircleFill />
                <p>{message[0]}</p>
              </div>
            </div>
          ) : null}
          {body && (
            <div className={styles.form_container_box}>
              <form onSubmit={handleSubmit} className={styles.form_container}>
                <Input
                  text="E-mail"
                  type="email"
                  name="email"
                  required={true}
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
                      ? '* Email não cadastrado!'
                      : '* Insira um email válido'
                  }
                />
                <input
                  type="submit"
                  value="Enviar link de recuperção de senha"
                />
                {error && <p className={styles.p_error}>{error}</p>}
                <p className={styles.p_link}>
                  Não tem conta? <Link to="/register">Clique aqui.</Link>
                </p>
                <p className={styles.p_link}>
                  Já tem conta? <Link to="/login">Clique aqui.</Link>
                </p>
              </form>
            </div>
          )}
        </>
      ) : (
        <div className={stylesLoader.loader}></div>
      )}
    </section>
  );
}

export default NewPasswordEmail;
