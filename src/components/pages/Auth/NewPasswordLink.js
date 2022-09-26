import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

function NewPasswordLink() {
  const [user, setUser] = useState({});
  const [validated, setValidated] = useState({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState([]);
  const [submiting, setSubmiting] = useState(false);
  const [url, setUrl] = useState(true);
  const { id, token } = useParams();

  useEffect(() => {
    setUrl(true);
    setMessage([]);
    if (id && token) {
      setUser({ id, token });
      api
        .get(`/users/reset/${id}/${token}`)
        .then(response => {
          setMessage([response.data.message, 'success']);
        })
        .catch(error => {
          setUrl(false);
          setMessage([error.response.data.message, 'error']);
        });
    }
  }, [id, token]);

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
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

  const handleSubmit = async e => {
    e.preventDefault();
    let obj = { ...validated };
    if (validated.password === undefined) {
      obj = { ...obj, password: false };
    }
    if (validated.confirmpassword === undefined) {
      obj = { ...obj, confirmpassword: false };
    }
    setValidated(obj);
    if (!validated.password || !validated.confirmpassword) {
      setError('* Preencha os campos solicitados');
      return;
    }
    setError('');
    setSubmiting(true);
    try {
      await api.patch('/users/reset', user).then(response => {
        setUrl(false);
        setMessage([response.data.message, 'success']);
      });
    } catch (error) {
      setMessage([error.response.data.message, 'error']);
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
          {url && (
            <div className={styles.form_container_box}>
              <form onSubmit={handleSubmit} className={styles.form_container}>
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
                <input type="submit" value="Atualizar senha" />
                {error && <p className={styles.p_error}>{error}</p>}
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

export default NewPasswordLink;
