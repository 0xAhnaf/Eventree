import { Save } from "lucide-react";

function ProfileSaveBar({ isSaving, saveMessage, onReset }) {
  return (
    <section className="vbp-save-bar">
      <div>
        <strong>Ready to save your profile?</strong>
        <p>
          Amenities and packages save when you click Save. Images and cover
          photo save immediately.
        </p>
        {saveMessage && <span className="vbp-save-message">{saveMessage}</span>}
      </div>

      <div className="vbp-save-actions">
        <button type="button" className="vbp-reset-button" onClick={onReset}>
          Discard changes
        </button>

        <button type="submit" className="vbp-save-button" disabled={isSaving}>
          <Save size={18} />
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </section>
  );
}

export default ProfileSaveBar;
