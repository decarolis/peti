import styles from './TextArea.module.scss';

function TextArea({
  text,
  name,
  placeholder,
  handleOnChange,
  value,
  required,
}) {
  return (
    <div className={styles.form_control}>
      <label htmlFor={name}>{text}:</label>
      <textarea
        name={name}
        id={name}
        rows="4"
        cols="50"
        placeholder={placeholder}
        onChange={handleOnChange}
        value={value}
        required={required}
      />
    </div>
  );
}

export default TextArea;
