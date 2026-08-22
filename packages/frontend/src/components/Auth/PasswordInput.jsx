import { useState } from "react";

function PasswordInput({
  id,
  label,
  placeholder = "Password",
  value,
  onChange,
  name,
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>

      <div className="password-input">
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />

        <button type="button" onClick={() => setShow(!show)}>
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;
