import { useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import geoapi from '../../utils/geoapi';
import Input from './Input';
import InputAge from './InputAge';
import TextArea from './TextArea';
import Select from './Select';
import Map from '../layout/Map';

/* css */
import styles from './Form.module.scss';

function PetForm({ handleSubmit, petData, petPosition, btnText }) {
  const [pet, setPet] = useState(petData || { years: 0, months: 0 });
  const [preview, setPreview] = useState([]);
  const [locationError, setLocationError] = useState('');
  const [position, setPosition] = useState(petPosition || []);
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

  function onFileChange(e) {
    setPreview(Array.from(e.target.files));
    setPet({ ...pet, images: [...e.target.files] });
  }

  function handleChange(e) {
    setPet({ ...pet, [e.target.name]: e.target.value });
  }

  function handleType(e) {
    setPet({
      ...pet,
      type: e.target.options[e.target.selectedIndex].text,
    });
  }

  function handleSex(e) {
    setPet({
      ...pet,
      sex: e.target.options[e.target.selectedIndex].text,
    });
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
      setLocationError('* Seleciona uma posiçao dentro de Portugal');
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
    if (position.length !== 0) {
      handleSubmit(pet);
    } else {
      setLocationError('* Seleciona uma posiçao dentro de Portugal');
    }
  };

  return (
    <form onSubmit={submit} className={styles.form_container}>
      <div className={styles.preview_pet_images}>
        {preview.length > 0
          ? preview.map((image, index) => (
              <img
                src={URL.createObjectURL(image)}
                alt={pet.name}
                key={`${pet.name}+${index}`}
              />
            ))
          : pet.images &&
            pet.images.map((image, index) => (
              <img
                src={`${process.env.REACT_APP_API}/images/pets/${image}`}
                alt={pet.name}
                key={`${pet.name}+${index}`}
              />
            ))}
      </div>
      <Input
        text="Imagens do pet"
        type="file"
        name="images"
        handleOnChange={onFileChange}
        multiple={true}
        required={pet.images ? false : true}
      />
      <Select
        name="type"
        text="Selecione o tipo"
        options={types}
        handleOnChange={handleType}
        value={pet.type || ''}
        required={true}
      />
      <Input
        text="Especifique o tipo"
        type="text"
        name="specificType"
        placeholder="ex: Labrador"
        handleOnChange={handleChange}
        value={pet.specificType || ''}
        required={true}
      />
      <Input
        text="Nome do pet"
        type="text"
        name="name"
        placeholder="Digite o nome"
        handleOnChange={handleChange}
        value={pet.name || ''}
        required={true}
      />
      <Select
        name="sex"
        text="Selecione o sexo"
        options={sex}
        handleOnChange={handleSex}
        value={pet.sex || ''}
        required={true}
      />
      <p className={styles.p_label}>Idade do Pet:</p>
      <div className={styles.input_age}>
        <InputAge
          text="Anos:"
          name="years"
          placeholder="0"
          handleOnChange={handleChange}
          value={pet.years || 0}
          min="0"
          max="99"
          required={true}
        />
        <InputAge
          text="Meses:"
          name="months"
          placeholder="0"
          handleOnChange={handleChange}
          value={pet.months || 0}
          min="0"
          max="12"
          required={true}
        />
      </div>
      <Input
        text="Peso do pet"
        type="number"
        name="weight"
        placeholder="Digite o peso aproximado"
        value={pet.weight || ''}
        handleOnChange={handleChange}
        required={true}
      />
      <p className={styles.p_label}>Localização do Pet:</p>
      {locationError && <p className={styles.p_error}>{locationError}</p>}
      <Map Location={LocationFinderDummy} position={position} />
      {position.length > 0 && (
        <>
          <Input
            text="Distrito do pet"
            type="text"
            name="state"
            placeholder="Selecione um ponto no mapa"
            value={pet.state || ''}
            disabled={true}
            readOnly={true}
            required={true}
          />
          <Input
            text="Cidade do pet"
            type="text"
            name="city"
            placeholder="Selecione um ponto no mapa"
            value={pet.city || ''}
            disabled={true}
            readOnly={true}
            required={true}
          />
          <Input
            text="Freguesia do pet"
            type="text"
            name="district"
            placeholder="Selecione um ponto no mapa"
            value={pet.district || ''}
            disabled={true}
            readOnly={true}
            required={true}
          />
        </>
      )}
      <TextArea
        text="Bio do pet"
        name="bio"
        placeholder="Conte-nos um pouco sobre seu pet"
        handleOnChange={handleChange}
        value={pet.bio || ''}
        required={true}
      />
      <input type="submit" value={btnText} />
    </form>
  );
}

export default PetForm;
