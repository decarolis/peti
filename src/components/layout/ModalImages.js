import { useCallback, useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

/* css */
import styles from './ModalImages.module.scss';

function ModalImages({ image, pet, classname }) {
  const [mainImage, setMainImage] = useState(image);

  function selectClass(origin) {
    if (origin === 'home') return styles.pet_images_container_home;
    if (origin === 'details') return styles.pet_images_container_details;
  }

  function handleMainImage(image, index) {
    setMainImage([image, index]);
  }

  const handleNextImage = useCallback(
    signal => {
      if (signal === '+' && mainImage[1] === pet.images.length - 1) {
        return;
      } else if (signal === '+') {
        setMainImage([pet.images[mainImage[1] + 1], mainImage[1] + 1]);
      }
      if (signal === '-' && mainImage[1] === 0) {
        return;
      } else if (signal === '-') {
        setMainImage([pet.images[mainImage[1] - 1], mainImage[1] - 1]);
      }
    },
    [mainImage, pet.images],
  );

  function disableButton(index, signal) {
    if (signal === '+' && index === pet.images.length - 1) {
      return styles.disable_button;
    } else if (signal === '-' && index === 0) {
      return styles.disable_button;
    } else {
      return '';
    }
  }

  function handleImageList(img, index) {
    if (img === mainImage[0] && index === mainImage[1]) {
      return styles.image_list;
    } else {
      return '';
    }
  }

  useEffect(() => {
    const listener = event => {
      if (event.key == 'ArrowLeft') handleNextImage('-');
      if (event.key == 'ArrowRight') handleNextImage('+');
    };
    if (mainImage.length > 0) {
      document.addEventListener('keydown', listener);
    }
    return () => document.removeEventListener('keydown', listener);
  }, [mainImage, handleNextImage]);

  return (
    <div className={`${selectClass(classname)}`}>
      <div className={styles.pet_image}>
        <img
          className={`${
            mainImage[1] % 2 === 0
              ? styles.pet_image_tag_0
              : styles.pet_image_tag_1
          }`}
          src={`${process.env.REACT_APP_API}/images/pets/${pet._id}/${mainImage[0]}`}
          alt={pet.name}
        />
      </div>
      <div className={styles.pet_images}>
        {pet.images.map((image, index) => (
          <img
            onClick={() => handleMainImage(image, index)}
            key={index}
            src={`${process.env.REACT_APP_API}/images/pets/${pet._id}/${image}`}
            alt={pet.name}
            className={handleImageList(image, index)}
          />
        ))}
      </div>
      <div
        onClick={() => handleNextImage('-')}
        className={`${styles.arrow_left} ${styles.arrow} ${disableButton(
          mainImage[1],
          '-',
        )}`}
      >
        <FaArrowLeft />
      </div>
      <div
        onClick={() => handleNextImage('+')}
        className={`${styles.arrow_right} ${styles.arrow} ${disableButton(
          mainImage[1],
          '+',
        )}`}
      >
        <FaArrowRight />
      </div>
    </div>
  );
}

export default ModalImages;
