import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import Input from '../../form/Input';
import { TbTrashX } from 'react-icons/tb';

/* css */
import styles from '../../form/Form.module.scss';

/* hooks */
import useFlashMessage from '../../../hooks/useFlashMessage';

/* contexts */
import { Context } from '../../../context/UserContext';

function Profile() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState();
  const [token] = useState(localStorage.getItem('token') || '');
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

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
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

    setFlashMessage(data.message, msgType);
  };

  return (
    <>
      {user.name && (
        <section>
          <h1>Perfil</h1>
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
              />
              <Input
                text="Telefone"
                type="text"
                name="phone"
                placeholder="Digite o seu telefone"
                handleOnChange={handleChange}
                value={user.phone || ''}
              />
              {/* <Input
          text="Senha"
          type="password"
          name="password"
          placeholder="Digite a sua senha"
          handleOnChange={handleChange}
        />
        <Input
          text="Confirmação de senha"
          type="password"
          name="confirmpassword"
          placeholder="Confirme a sua senha"
          handleOnChange={handleChange}
        /> */}
              <input type="submit" value="Salvar" />
            </form>
          </div>
        </section>
      )}
    </>
  );
}

export default Profile;
