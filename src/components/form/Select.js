import styles from './Inputs.module.scss';

function Select({
  text,
  name,
  options,
  handleOnChange,
  value,
  required,
  classname,
}) {
  const selectClass = classname => (classname ? styles.select_color : {});
  return (
    <div className={styles.form_select}>
      <label htmlFor={name}>{text}</label>
      <select
        className={`${selectClass(classname)}`}
        name={name}
        id={name}
        onChange={handleOnChange}
        defaultValue={value}
        required={required}
      >
        <option disabled value="">
          Selecione uma opção
        </option>
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
