import styles from './Inputs.module.scss';

function TextArea({
  text,
  name,
  placeholder,
  handleOnChange,
  value,
  required,
  maxlength,
}) {
  return (
    <div className={styles.form_textarea}>
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
      />
    </div>
  );
}

export default TextArea;
