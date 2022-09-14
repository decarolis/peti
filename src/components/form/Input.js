import styles from './Input.module.scss';

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
}) {
  return (
    <div className={styles.form_control}>
      <label htmlFor={name}>{text}:</label>
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
      />
    </div>
  );
}

export default Input;
