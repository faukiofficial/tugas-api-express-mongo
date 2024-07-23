import './index.scss';

const Input = ({ name, type, placeholder, label, value, onChange, checked }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      {type === 'checkbox' ? (
        <input
          type={type}
          name={name}
          checked={checked}
          onChange={onChange}
        />
      ) : type === 'file' ? (
        <input
          type={type}
          name={name}
          onChange={onChange}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default Input;
