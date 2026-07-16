function SubmitButton({
    text,
    disabled = false
}) {
    return (
        <button
            type="submit"
            className="submit-btn"
            disabled={disabled}
        >
            {text}
        </button>
    );
}

export default SubmitButton;