import { Camera, Upload } from "lucide-react";
import ProfileSectionHeading from "./ProfileSectionHeading.jsx";

function CoverImageCard({ onCoverUpload }) {
  return (
    <section className="vbp-card vbp-cover-card">
      <ProfileSectionHeading
        icon={Camera}
        title="Cover image"
        description="Recommended ratio: 16:6"
        compact
      />

      <label className="vbp-upload-button">
        <Upload size={17} />
        Replace cover image
        <input type="file" accept="image/*" onChange={onCoverUpload} />
      </label>

      <p className="vbp-upload-note">Cover image changes upload immediately.</p>
    </section>
  );
}

export default CoverImageCard;
