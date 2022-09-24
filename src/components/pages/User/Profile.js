import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import Input from '../../form/Input';
import { TbTrashX } from 'react-icons/tb';

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
        console.log('oi');
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
    setPreview(e.target.files[0]);
    setUser({ ...user, [e.target.name]: e.target.files[0] });
  }

  function removeImage() {
    window.scrollTo(0, 0);
    setPreview('');
    setUser({ ...user, image: 'defaultimage.jpg' });
  }

  const handleSubmit = async e => {
    e.preventDefault();

    if (
      !validated.name ||
      !validated.phone ||
      validated.password === false ||
      !validated.confirmpassword === false
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
      .patch(`/users/edit/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        window.scrollTo(0, 0);
        return response.data;
      })
      .catch(err => {
        console.log(err);
        msgType = 'error';
        return err.response.data;
      });
    setSubmiting(false);
    setFlashMessage(data.message, msgType);
  };

  return (
    <section>
      <h1>Perfil</h1>
      {!loading && !submiting ? (
        <div className={styles.form_container_box}>
          <form onSubmit={handleSubmit} className={styles.form_container}>
            <Input
              text="Adicionar Imagen"
              type="file"
              name="image"
              handleOnChange={onFileChange}
              accept="image/jpg, image/png, image/jpeg"
            />
            <div className={styles.preview_user_image}>
              {preview || user.image !== 'defaultimage.jpg' ? (
                <>
                  <button className={styles.remove}>
                    <TbTrashX onClick={removeImage} />
                  </button>
                  <img
                    src={
                      preview
                        ? URL.createObjectURL(preview)
                        : `${process.env.REACT_APP_API}/images/users/${user.image}`
                    }
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
            <input
              type="button"
              value="Alterar senha"
              onClick={() => {
                if (
                  validated.password === undefined &&
                  validated.password === undefined
                ) {
                  setChangePassword(prev => !prev);
                }
              }}
            />
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
