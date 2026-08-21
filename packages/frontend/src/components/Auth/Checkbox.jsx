function Checkbox({
    text,
    checked,
    onChange,
    required = false
}) {
    return (
        <label className="checkbox">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                required={required}
            />

            <span>{text}</span>
        </label>
    );
}

export default Checkbox;