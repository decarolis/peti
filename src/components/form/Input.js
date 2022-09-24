import {
  BsFillCheckCircleFill,
  BsFillExclamationCircleFill,
} from 'react-icons/bs';

/* css */
import styles from './Inputs.module.scss';

function Input({
  type,
  text,
  name,
  placeholder,
  handleOnChange,
  value,
  multiple,
  disabled,
  readOnly,
  required,
  accept,
  maxlength,
  pattern,
  handleOnFocus,
  handleOnBlur,
  validatedClass,
  error,
}) {
  return (
    <div className={`${styles.form_input} ${styles[validatedClass]}`}>
      <label htmlFor={name}>{text}</label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        onChange={handleOnChange}
        value={value}
        multiple={multiple}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        accept={accept}
        maxLength={maxlength}
        pattern={pattern}
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

export default Input;
