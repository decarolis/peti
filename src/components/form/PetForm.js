import { useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import geoapi from '../../utils/geoapi';
import Input from './Input';
import InputAgeWeight from './InputAgeWeight';
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
  const [selectClass1, setSelectClass1] = useState(false);
  const [selectClass2, setSelectClass2] = useState(false);
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
    const filter = [];
    const test = Array.from(e.target.files);
    for (let i = 0; i < test.length; i++) {
      if (test[i].size < imageLimitSize && filter.length < imageLimitQnt) {
        filter.push(test[i]);
      }
    }
    setPreview(filter);
    setPet({ ...pet, images: [...filter] });
  }

  console.log(preview);

  function handleChange(e) {
    setPet({ ...pet, [e.target.name]: e.target.value });
  }

  function handleType(e) {
    setPet({
      ...pet,
      type: e.target.options[e.target.selectedIndex].text,
    });
    setSelectClass1(true);
  }

  function handleSex(e) {
    setPet({
      ...pet,
      sex: e.target.options[e.target.selectedIndex].text,
    });
    setSelectClass2(true);
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
      console.log(pet);
      handleSubmit(pet);
    } else {
      setLocationError('* Seleciona uma posiçao dentro de Portugal');
    }
  };

  return (
    <div className={styles.form_container_box}>
      <form onSubmit={submit} className={styles.form_container}>
        <Input
          text="Adicionar Imagens"
          type="file"
          name="images"
          handleOnChange={onFileChange}
          multiple={true}
          required={pet.images ? false : true}
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
          ) : pet.images !== undefined ? (
            pet.images.map((image, index) => (
              <img
                src={`${process.env.REACT_APP_API}/images/pets/${image}`}
                alt={pet.name}
                key={`${pet.name}+${index}`}
              />
            ))
          ) : (
            <>
              <p>Quantidade máxima de imagens: 8</p>
              <p>Tamanho máximo por imagem: 2MB</p>
            </>
          )}
        </div>
        <Select
          name="type"
          text="Selecione o tipo"
          options={types}
          handleOnChange={handleType}
          classname={selectClass1}
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
          text="Nome"
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
          classname={selectClass2}
          value={pet.sex || ''}
          required={true}
        />
        <p className={styles.p_label}>Idade</p>
        <div className={styles.input_age_weight_container}>
          <InputAgeWeight
            text="Anos:"
            name="years"
            placeholder="0"
            handleOnChange={handleChange}
            value={pet.years || ''}
            min="0"
            max="999"
            required={false}
          />
          <InputAgeWeight
            text="Meses:"
            name="months"
            placeholder="0"
            handleOnChange={handleChange}
            value={pet.months || ''}
            min="0"
            max="12"
            required={false}
          />
        </div>
        <p className={styles.p_label}>Peso</p>
        <div className={styles.input_age_weight_container}>
          <InputAgeWeight
            text="Kg:"
            name="weightKg"
            placeholder="0"
            handleOnChange={handleChange}
            value={pet.weightKg || ''}
            min="0"
            max="9999"
            required={false}
          />
          <InputAgeWeight
            text="g:"
            name="weightG"
            placeholder="0"
            handleOnChange={handleChange}
            value={pet.weightG || ''}
            min="0"
            max="900"
            step="100"
            required={false}
          />
        </div>
        <p className={styles.p_label}>Localização</p>
        {locationError && <p className={styles.p_error}>{locationError}</p>}
        <div className={styles.map}>
          <Map Location={LocationFinderDummy} position={position} />
        </div>
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
              required={true}
            />
            <Input
              text="Cidade"
              type="text"
              name="city"
              placeholder="Selecione um ponto no mapa"
              value={pet.city || ''}
              disabled={true}
              readOnly={true}
              required={true}
            />
            <Input
              text="Freguesia"
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
          text="Bio"
          name="bio"
          placeholder="Conte-nos um pouco sobre seu pet"
          handleOnChange={handleChange}
          value={pet.bio || ''}
          required={true}
        />
        <input type="submit" value={btnText} />
      </form>
    </div>
  );
}

export default PetForm;
