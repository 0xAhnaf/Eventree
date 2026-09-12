import { AlertCircle } from "lucide-react";

function ProfileAlert({ message }) {
  if (!message) return null;

  return (
    <div
      className="vbp-error-banner"
      style={{
        backgroundColor: "#fef2f2",
        border: "1px solid #f87171",
        color: "#991b1b",
        padding: "12px 16px",
        borderRadius: "8px",
        marginBottom: "16px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontWeight: 500,
      }}
    >
      <AlertCircle size={20} color="#dc2626" />
      <span>{message}</span>
    </div>
  );
}

export default ProfileAlert;
