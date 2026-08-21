function SubmitButton({
  text,
  loading = false,
  disabled = false,
}) {
  return (
    <button
      type="submit"
      className="submit-btn"
      disabled={disabled || loading}
    >
      {loading ? <span className="loading-spinner"></span> : text}
    </button>
  );
}

export default SubmitButton;
