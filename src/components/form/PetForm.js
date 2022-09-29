import { useEffect, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import geoapi from '../../utils/geoapi';
import Input from './Input';
import InputDouble from './InputDouble';
import TextArea from './TextArea';
import Select from './Select';
import Map from '../layout/Map';

/* css */
import styles from './Form.module.scss';

function PetForm({ handleSubmit, petData, petPosition, btnText }) {
  const [pet, setPet] = useState(petData || {});
  const [preview, setPreview] = useState([]);
  const [imageLimitSize] = useState(2097152);
  const [imageLimitQnt] = useState(8);
  const [locationError, setLocationError] = useState('');
  const [position, setPosition] = useState(petPosition || []);
  const [validated, setValidated] = useState({});
  const [error, setError] = useState('');
  const sex = ['Fêmea', 'Macho', 'Indefinido'];
  const types = [
    'Cão',
    'Gato',
    'Cavalo',
    'Porco',
    'Coelho',
    'Hamster',
    'Porquinho-da-índia',
    'Peixe',
    'Ave',
    'Réptil',
    'Anfíbio',
    'Invertebrado',
    'Outro',
  ];

  useEffect(() => {
    if (petData) {
      let obj = {};
      for (let x in petData) {
        obj = { ...obj, [x]: true };
      }
      setValidated(obj);
    }
  }, [petData]);

  function onFileChange(e) {
    const filter = [];
    const test = Array.from(e.target.files);
    for (let i = 0; i < test.length; i++) {
      if (test[i].size < imageLimitSize && filter.length < imageLimitQnt) {
        filter.push(test[i]);
      }
    }
    if (filter.length > 0) {
      setValidated({ ...validated, images: true });
    } else {
      setValidated({ ...validated, images: false });
    }
    setPreview(filter);
    setPet({ ...pet, images: [...filter] });
  }

  function handleChange(e) {
    setPet({ ...pet, [e.target.name]: e.target.value });
    if (e.target.value !== '') {
      setValidated({ ...validated, [e.target.name]: true });
    } else if (validated[e.target.name] === true) {
      setValidated({ ...validated, [e.target.name]: false });
    }
  }

  function handleSelect(e) {
    setPet({
      ...pet,
      [e.target.name]: e.target.options[e.target.selectedIndex].text,
    });
    if (e.target.options[e.target.selectedIndex].text !== '') {
      setValidated({ ...validated, [e.target.name]: true });
    } else if (validated[e.target.name] === true) {
      setValidated({ ...validated, [e.target.name]: false });
    }
  }

  function handleBlur(e) {
    if (!e.target.value) {
      setValidated({ ...validated, [e.target.name]: false });
    }
  }

  async function findAdress(lat, lng) {
    try {
      const data = await geoapi.get(`/${lat},${lng}?json=1`).then(response => {
        return response.data;
      });

      setPet({
        ...pet,
        state: data.distrito || data.ilha,
        city: data.concelho,
        district: data.freguesia,
        latLong: [lat, lng],
      });
      setPosition([lat, lng]);
      setLocationError('');
    } catch (e) {
      setPet({
        ...pet,
        state: '',
        city: '',
        district: '',
        latLong: [],
      });
      setPosition([]);
      setLocationError('* Selecione uma posiçao dentro de Portugal');
    }
  }

  const LocationFinderDummy = () => {
    useMapEvents({
      async click(e) {
        await findAdress(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  const submit = e => {
    e.preventDefault();
    let obj = { ...validated };
    if (validated.images === undefined) {
      obj = { ...obj, images: false };
    }
    if (validated.type === undefined) {
      obj = { ...obj, type: false };
    }
    if (validated.specificType === undefined) {
      obj = { ...obj, specificType: false };
    }
    if (validated.name === undefined) {
      obj = { ...obj, name: false };
    }
    if (validated.sex === undefined) {
      obj = { ...obj, sex: false };
    }
    if (validated.years === undefined && validated.months === undefined) {
      obj = { ...obj, years: false, months: false };
    }
    if (validated.weightKg === undefined && validated.weightG === undefined) {
      obj = { ...obj, weightKg: false, weightG: false };
    }
    if (validated.bio === undefined) {
      obj = { ...obj, bio: false };
    }
    setValidated(obj);
    if (
      !validated.images ||
      !validated.type ||
      !validated.specificType ||
      !validated.name ||
      !validated.sex ||
      !(validated.years || validated.months) ||
      !(validated.weightKg || validated.weightG) ||
      !validated.bio
    ) {
      setError('* Preencha os campos solicitados');
      if (position.length === 0) {
        setLocationError('* Selecione uma posiçao dentro de Portugal');
      }
      return;
    }

    handleSubmit(pet);
  };

  return (
    <div className={styles.form_container_box}>
      <form onSubmit={submit} className={styles.form_container}>
        <Input
          text={
            preview.length > 0 || (pet.images && pet.images.length > 0)
              ? 'Trocar imagens'
              : 'Adicionar imagens'
          }
          type="file"
          name="images"
          handleOnChange={onFileChange}
          multiple={true}
          accept="image/jpg, image/png, image/jpeg"
        />
        <div className={styles.preview_pet_images}>
          {preview.length > 0 ? (
            preview.map((image, index) => (
              <img
                src={URL.createObjectURL(image)}
                alt={pet.name}
                key={`${pet.name}+${index}`}
              />
            ))
          ) : pet.images && pet.images.length > 0 ? (
            pet.images.map((image, index) => (
              <img
                src={`${process.env.REACT_APP_API}/images/pets/${pet._id}/${image}`}
                alt={pet.name}
                key={`${pet.name}+${index}`}
              />
            ))
          ) : (
            <div className={styles.prerequisite}>
              <p>Quantidade máxima de imagens: 8</p>
              <p>Tamanho máximo por imagem: 2MB</p>
              <p>Imagens maiores que 2MB serão ignoradas</p>
            </div>
          )}
        </div>
        {validated.images === false && (
          <p className={styles.p_error}>* Insira ao menos uma imagem</p>
        )}
        <Select
          name="type"
          text="Selecione o tipo"
          options={types}
          handleOnChange={handleSelect}
          handleOnBlur={handleBlur}
          classname={pet.type ? 'select_color' : ''}
          value={pet.type || ''}
          validatedClass={
            validated.type === undefined
              ? ''
              : validated.type
              ? 'success'
              : 'error'
          }
          error="* Selecione uma opção"
        />
        <Input
          text="Especifique o tipo"
          type="text"
          name="specificType"
          placeholder="ex: Labrador"
          handleOnChange={handleChange}
          handleOnBlur={handleBlur}
          value={pet.specificType || ''}
          maxlength="30"
          validatedClass={
            validated.specificType === undefined
              ? ''
              : validated.specificType
              ? 'success'
              : 'error'
          }
          error="* Especifique o tipo"
        />
        <Input
          text="Nome"
          type="text"
          name="name"
          placeholder="Digite o nome"
          handleOnChange={handleChange}
          handleOnBlur={handleBlur}
          value={pet.name || ''}
          maxlength="30"
          validatedClass={
            validated.name === undefined
              ? ''
              : validated.name
              ? 'success'
              : 'error'
          }
          error="* Insira um nome válido"
        />
        <Select
          name="sex"
          text="Selecione o sexo"
          options={sex}
          handleOnChange={handleSelect}
          handleOnBlur={handleBlur}
          classname={pet.sex ? 'select_color' : ''}
          value={pet.sex || ''}
          validatedClass={
            validated.sex === undefined
              ? ''
              : validated.sex
              ? 'success'
              : 'error'
          }
          error="* Selecione uma opção"
        />
        <InputDouble
          label="Idade"
          text1="Anos:"
          text2="Meses:"
          name1="years"
          name2="months"
          placeholder1="0"
          placeholder2="0"
          handleOnChange={handleChange}
          handleOnBlur={handleBlur}
          value1={pet.years || ''}
          value2={pet.months || ''}
          min1="0"
          min2="0"
          max1="999"
          max2="12"
          validatedClass={
            validated.years === undefined && validated.months === undefined
              ? ''
              : validated.years || validated.months
              ? 'success'
              : 'error'
          }
          error="* Insira uma idade válida"
        />
        <InputDouble
          label="Peso"
          text1="Kg:"
          text2="g:"
          name1="weightKg"
          name2="weightG"
          placeholder1="0"
          placeholder2="0"
          handleOnChange={handleChange}
          handleOnBlur={handleBlur}
          value1={pet.weightKg || ''}
          value2={pet.weightG || ''}
          min1="0"
          min2="0"
          max1="9999"
          max2="900"
          step="100"
          validatedClass={
            validated.weightKg === undefined && validated.weightG === undefined
              ? ''
              : validated.weightKg || validated.weightG
              ? 'success'
              : 'error'
          }
          error="* Insira um peso válido"
        />
        <Map
          text="Localização"
          Location={LocationFinderDummy}
          position={position}
          locationError={locationError}
        />
        {position.length > 0 && (
          <>
            <Input
              text="Distrito"
              type="text"
              name="state"
              placeholder="Selecione um ponto no mapa"
              value={pet.state || ''}
              disabled={true}
              readOnly={true}
              validatedClass={'success'}
            />
            <Input
              text="Cidade"
              type="text"
              name="city"
              placeholder="Selecione um ponto no mapa"
              value={pet.city || ''}
              disabled={true}
              readOnly={true}
              validatedClass={'success'}
            />
            <Input
              text="Freguesia"
              type="text"
              name="district"
              placeholder="Selecione um ponto no mapa"
              value={pet.district || ''}
              disabled={true}
              readOnly={true}
              validatedClass={'success'}
            />
          </>
        )}
        <TextArea
          text="Bio"
          name="bio"
          placeholder="Conte-nos um pouco sobre seu pet"
          handleOnChange={handleChange}
          handleOnBlur={handleBlur}
          value={pet.bio || ''}
          maxlength="500"
          validatedClass={
            validated.bio === undefined
              ? ''
              : validated.bio
              ? 'success'
              : 'error'
          }
          error="* Conte-nos um pouco sobre seu pet"
        />
        <input type="submit" value={btnText} />
        {error && <p className={styles.p_error}>{error}</p>}
      </form>
    </div>
  );
}

export default PetForm;
