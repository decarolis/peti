import styles from './InputAge.module.scss';

function InputAge({
  text,
  name,
  handleOnChange,
  value,
  min,
  max,
  placeholder,
  required,
}) {
  return (
    <div className={styles.form_control}>
      <div className={styles.fixed_text}>{text}</div>
      <input
        type="number"
        name={name}
        id={name}
        onChange={handleOnChange}
        value={value}
        placeholder={placeholder}
        min={min}
        max={max}
        required={required}
      />
    </div>
  );
}

export default InputAge;
