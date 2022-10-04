import {
  BsFillCheckCircleFill,
  BsFillExclamationCircleFill,
} from 'react-icons/bs';

/* css */
import styles from './Inputs.module.scss';

function Select({
  text,
  name,
  options,
  handleOnChange,
  value,
  required,
  classname,
  handleOnFocus,
  handleOnBlur,
  validatedClass,
  error,
  filter,
}) {
  return (
    <div className={`${styles.form_select} ${styles[validatedClass]}`}>
      <label htmlFor={name}>{text}</label>
      <select
        className={`${styles[classname]}`}
        name={name}
        id={name}
        onChange={handleOnChange}
        defaultValue={value}
        required={required}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
      >
        {!filter && (
          <option value="">
            {text === 'Tipo' || text === 'Sexo' ? '' : 'Selecione uma opção'}
          </option>
        )}
        {options.map(option => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
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

export default Select;
