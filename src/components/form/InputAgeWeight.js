import styles from './Inputs.module.scss';

function InputAge({
  text,
  name,
  handleOnChange,
  value,
  min,
  max,
  placeholder,
  required,
  step,
}) {
  return (
    <div className={styles.box_age_weight}>
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
        step={step}
      />
    </div>
  );
}

export default InputAge;
