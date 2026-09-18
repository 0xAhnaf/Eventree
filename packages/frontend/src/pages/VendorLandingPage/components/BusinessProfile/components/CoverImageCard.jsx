import { Camera, Upload } from "lucide-react";
import ProfileSectionHeading from "./ProfileSectionHeading.jsx";

function CoverImageCard({ coverImage, onCoverUpload }) {
  return (
    <section className="vbp-card vbp-cover-card">
      <ProfileSectionHeading
        icon={Camera}
        title="Cover image"
        description="Recommended ratio: 16:6"
        compact
      />

      {coverImage && (
        <img
          className="vbp-current-cover"
          src={coverImage}
          alt="Current business cover"
        />
      )}

      <label className="vbp-upload-button">
        <Upload size={17} />
        {coverImage ? "Upload new cover image" : "Upload cover image"}
        <input type="file" accept="image/*" onChange={onCoverUpload} />
      </label>

      <p className="vbp-upload-note">Cover image changes upload immediately.</p>
    </section>
  );
}

export default CoverImageCard;
