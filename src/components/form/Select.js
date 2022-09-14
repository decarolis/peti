import styles from './Select.module.scss';

function Select({ text, name, options, handleOnChange, value, required }) {
  return (
    <div className={styles.form_control}>
      <label htmlFor={name}>{text}:</label>
      <select
        name={name}
        id={name}
        onChange={handleOnChange}
        defaultValue={value}
        required={required}
      >
        <option value="">Selecione uma opção</option>
        {options.map(option => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
