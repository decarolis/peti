import { useState, useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  BsFillExclamationCircleFill,
  BsFillCheckCircleFill,
} from 'react-icons/bs';
import api from '../../../utils/api';
import Input from '../../form/Input';
import ReactGA from 'react-ga';

/* css*/
import styles from '../../form/Form.module.scss';
import messageStyles from '../../layout/Message.module.scss';
import stylesLoader from '../../layout/Loader.module.scss';

/* contexts */
import { Context } from '../../../context/UserContext';

function Login() {
  const [user, setUser] = useState({});
  const [message, setMessage] = useState([]);
  const [submiting, setSubmiting] = useState(false);
  const [url, setUrl] = useState(true);
  const { id, token } = useParams();
  const { login } = useContext(Context);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, []);

  useEffect(() => {
    setUrl(true);
    setMessage([]);
    if (id && token) {
      api
        .get(`/users/activate/${id}/verify/${token}`)
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
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmiting(true);
    const response = await login(user);
    if (response[0]) {
      setMessage(response);
      setSubmiting(false);
    }
  };

  return (
    <section>
      <h1>Login</h1>
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
                  text="E-mail"
                  type="email"
                  name="email"
                  required={true}
                  placeholder="Digite seu e-mail"
                  handleOnChange={handleChange}
                  value={user.email || ''}
                />
                <Input
                  text="Senha"
                  type="password"
                  name="password"
                  required={true}
                  placeholder="Digite sua senha"
                  handleOnChange={handleChange}
                  value={user.password || ''}
                />
                <input type="submit" value="Entrar" />
                <p className={styles.p_link}>
                  Esqueceu sua senha?{' '}
                  <Link to="/forgotmypassword">Clique aqui.</Link>
                </p>
                <p className={styles.p_link}>
                  Não tem conta? <Link to="/register">Clique aqui.</Link>
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

export default Login;
