import {
  BsFillCheckCircleFill,
  BsFillExclamationCircleFill,
} from 'react-icons/bs';

/* css */
import styles from './Inputs.module.scss';

function InputDouble({
  label,
  text1,
  text2,
  name1,
  name2,
  handleOnChange,
  value1,
  value2,
  min1,
  min2,
  max1,
  max2,
  placeholder1,
  placeholder2,
  step,
  handleOnFocus,
  handleOnBlur,
  validatedClass,
  error,
}) {
  return (
    <div
      className={`${styles.input_double_container} ${styles[validatedClass]}`}
    >
      <label>{label}</label>
      <div className={styles.box}>
        <div className={styles.field}>
          <p className={styles.fixed_text}>{text1}</p>
          <input
            type="number"
            name={name1}
            onChange={handleOnChange}
            value={value1}
            placeholder={placeholder1}
            min={min1}
            max={max1}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
          />
        </div>
        <div className={styles.field}>
          <p className={styles.fixed_text}>{text2}</p>
          <input
            type="number"
            name={name2}
            onChange={handleOnChange}
            value={value2}
            placeholder={placeholder2}
            min={min2}
            max={max2}
            step={step}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
          />
        </div>
      </div>
      {validatedClass === 'error' ? (
        <>
          <span>
            <BsFillExclamationCircleFill />
          </span>
          <p className={styles.p_error}>{error}</p>
        </>
      ) : validatedClass === 'success' ? (
        <>
          <span>
            <BsFillCheckCircleFill />
          </span>
        </>
      ) : (
        ''
      )}
    </div>
  );
}

export default InputDouble;
