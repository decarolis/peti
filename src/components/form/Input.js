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
}) {
  return (
    <div className={styles.form_input}>
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
      />
    </div>
  );
}

export default Input;
