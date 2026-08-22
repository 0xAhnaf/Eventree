function AuthInput({ label, id, type = "text", placeholder, ...props }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>

      <input id={id} type={type} placeholder={placeholder} {...props} />
    </div>
  );
}

export default AuthInput;
