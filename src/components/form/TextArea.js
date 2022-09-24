import {
  BsFillCheckCircleFill,
  BsFillExclamationCircleFill,
} from 'react-icons/bs';

/* css */
import styles from './Inputs.module.scss';

function TextArea({
  text,
  name,
  placeholder,
  handleOnChange,
  value,
  required,
  maxlength,
  handleOnFocus,
  handleOnBlur,
  validatedClass,
  error,
}) {
  return (
    <div className={`${styles.form_textarea} ${styles[validatedClass]}`}>
      <label htmlFor={name}>{text}</label>
      <textarea
        name={name}
        id={name}
        rows="4"
        cols="50"
        placeholder={placeholder}
        onChange={handleOnChange}
        value={value}
        required={required}
        maxLength={maxlength}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
      />
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

export default TextArea;
