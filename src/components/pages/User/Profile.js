import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import Input from '../../form/Input';
import { TbTrashX, TbChevronRight, TbChevronDown } from 'react-icons/tb';
import ReactGA from 'react-ga';

/* css */
import styles from '../../form/Form.module.scss';
import stylesLoader from '../../layout/Loader.module.scss';

/* hooks */
import useFlashMessage from '../../../hooks/useFlashMessage';

/* contexts */
import { Context } from '../../../context/UserContext';

function Profile() {
  const [user, setUser] = useState({});
  const [userData, setUserData] = useState({});
  const [imageLimitSize] = useState(2097152);
  const [loading, setLoading] = useState(true);
  const [submiting, setSubmiting] = useState(false);
  const [validated, setValidated] = useState({});
  const [changePassword, setChangePassword] = useState(false);
  const [error, setError] = useState('');
  const [token] = useState(localStorage.getItem('token') || '');
  const [preview, setPreview] = useState();
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();
  const { logout } = useContext(Context);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, []);

  useEffect(() => {
    let mounted = true;
    if (token && loading) {
      api
        .get('/users/checkuser', {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        })
        .then(response => {
          if (mounted) {
            setLoading(false);
            setUserData(response.data);
            setUser(response.data);
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
  }, [token, navigate, logout, loading]);

  useEffect(() => {
    if (userData) {
      let obj = {};
      for (let x in userData) {
        obj = { ...obj, [x]: true };
      }
      setValidated(obj);
    }
  }, [userData]);

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
    if (e.target.name === 'name') {
      if (/(.*[a-z]){3}/i.test(e.target.value)) {
        setValidated({ ...validated, name: true });
      } else if (validated.name === true) {
        setValidated({ ...validated, name: false });
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
      if (e.target.value === '') {
        setValidated({ ...validated, password: undefined });
        return;
      }
      if (
        /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{8,}$/.test(e.target.value)
      ) {
        setValidated({ ...validated, password: true });
      } else if (validated.password === true) {
        setValidated({ ...validated, password: false });
      }
    }
    if (e.target.name === 'confirmpassword') {
      if (e.target.value === '') {
        setValidated({ ...validated, confirmpassword: undefined });
        return;
      }
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
    if (e.target.name === 'phone') {
      if (!/(\D*\d){8}/.test(e.target.value)) {
        setValidated({ ...validated, phone: false });
      }
    }
    if (e.target.name === 'password') {
      if (e.target.value === '') {
        setValidated({ ...validated, password: undefined });
        return;
      }
      if (
        !/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{8,}$/.test(e.target.value)
      ) {
        setValidated({ ...validated, password: false });
      }
    }
    if (e.target.name === 'confirmpassword') {
      if (e.target.value === '') {
        setValidated({ ...validated, confirmpassword: undefined });
        return;
      }
      if (user.password && !(e.target.value === user.password)) {
        setValidated({ ...validated, confirmpassword: false });
      }
    }
  }

  function onFileChange(e) {
    if (e.target.files.length > 0) {
      if (e.target.files[0].size < imageLimitSize) {
        setPreview(e.target.files[0]);
        setUser({ ...user, [e.target.name]: e.target.files[0] });
        setValidated({ ...validated, image: true });
      } else {
        setValidated({ ...validated, image: false });
        setPreview('');
        setUser({ ...user, [e.target.name]: '' });
      }
    } else {
      setPreview('');
      setUser({ ...user, [e.target.name]: '' });
    }
  }

  function removeImage() {
    setPreview('');
    setUser({ ...user, image: '' });
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setValidated({ ...validated, image: true });

    if (
      !validated.name ||
      !validated.phone ||
      validated.password === false ||
      validated.confirmpassword === false
    ) {
      setError('* Preencha os campos solicitados');
      return;
    }
    setError('');
    setSubmiting(true);

    let msgType = 'success';

    const formData = new FormData();

    const userFormData = Object.keys(user).forEach(key =>
      formData.append(key, user[key]),
    );

    formData.append('user', userFormData);

    const data = await api
      .patch(`/users/edit`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        return response.data;
      })
      .catch(err => {
        msgType = 'error';
        setPreview('');
        setUser({ ...user, image: userData.image });
        return err.response.data;
      });
    setValidated({
      ...validated,
      password: undefined,
      confirmpassword: undefined,
      image: undefined,
    });
    setSubmiting(false);
    setFlashMessage(data.message, msgType);
  };

  return (
    <section>
      <h1>Perfil</h1>
      {!loading && !submiting && user.name !== undefined ? (
        <div className={styles.form_container_box}>
          <form onSubmit={handleSubmit} className={styles.form_container}>
            <Input
              text={
                preview || user.image ? 'Trocar imagem' : 'Adicionar imagem'
              }
              type="file"
              name="image"
              handleOnChange={onFileChange}
              accept="image/jpg, image/png, image/jpeg"
            />
            <div className={styles.preview_user_image}>
              {preview || user.image ? (
                <>
                  <button className={styles.remove}>
                    <TbTrashX onClick={removeImage} />
                  </button>
                  <img
                    src={
                      preview
                        ? URL.createObjectURL(preview)
                        : `https://api.peti.pt/images/users/${user._id}/${user.image}`
                    }
                    crossOrigin="anonymous"
                    alt={user.name}
                  />
                </>
              ) : (
                <div className={styles.prerequisite}>
                  <p>Adicione uma imagem ao seu perfil</p>
                  <p>Tamanho máximo da imagem: 2MB</p>
                  <p>Extensões suportadas: .jpg .jpeg .png</p>
                </div>
              )}
            </div>
            {validated.image === false && (
              <p className={styles.p_error}>* Tamanho máximo da imagem: 2MB</p>
            )}
            <Input
              text="E-mail"
              type="email"
              name="email"
              placeholder="Digite o e-mail"
              value={user.email || ''}
              disabled={true}
              readOnly={true}
            />
            <Input
              text="Nome"
              type="text"
              name="name"
              placeholder="Digite o nome"
              handleOnChange={handleChange}
              value={user.name || ''}
              handleOnBlur={handleBlur}
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
              placeholder="Digite o seu telefone"
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
            <label
              className={styles.change_password}
              onClick={() => {
                if (
                  validated.password === undefined &&
                  validated.confirmpassword === undefined
                ) {
                  setChangePassword(prev => !prev);
                }
              }}
            >
              Alterar senha{' '}
              {changePassword ? <TbChevronDown /> : <TbChevronRight />}
            </label>

            {changePassword && (
              <>
                <Input
                  text="Nova senha"
                  type="password"
                  name="password"
                  placeholder="Digite a sua nova senha"
                  handleOnChange={handleChange}
                  handleOnBlur={handleBlur}
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
                  text="Confirmação de nova senha"
                  type="password"
                  name="confirmpassword"
                  placeholder="Confirme a sua nova senha"
                  handleOnChange={handleChange}
                  handleOnBlur={handleBlur}
                  validatedClass={
                    validated.confirmpassword === undefined
                      ? ''
                      : validated.confirmpassword
                      ? 'success'
                      : 'error'
                  }
                  error="* A confirmaçao de senha precisa ser igual a senha"
                />
              </>
            )}
            <input type="submit" value="Salvar" />
            {error && <p className={styles.p_error}>{error}</p>}
          </form>
        </div>
      ) : (
        <div className={stylesLoader.loader}></div>
      )}
    </section>
  );
}

export default Profile;
