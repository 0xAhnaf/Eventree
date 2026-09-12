import { Camera, Check } from "lucide-react";

function PublicPreviewCard({
  profile,
  selectedCategoryName,
  formattedStartingPrice,
}) {
  return (
    <section className="vbp-card vbp-preview-card">
      <div className="vbp-preview-label">
        <span>Public preview</span>
        <span className="vbp-draft-badge">Draft</span>
      </div>

      <div className="vbp-preview-banner">
        {profile.coverImage ? (
          <img src={profile.coverImage} alt="Business cover preview" />
        ) : (
          <div className="vbp-empty-cover">
            <Camera size={30} />
            <span>Add a cover image</span>
          </div>
        )}

        <div className="vbp-preview-overlay" />

        <div className="vbp-preview-copy">
          <h3>{profile.businessName || "Your business name"}</h3>
          <p>
            {selectedCategoryName || "Vendor category"} ·{` `}
            {profile.location || "Location"}
          </p>
        </div>
      </div>

      <div className="vbp-preview-meta">
        <div>
          <span>Starting from</span>
          <strong>{formattedStartingPrice}</strong>
        </div>

        <span className="vbp-preview-verified">
          <Check size={15} />
          Vendor profile
        </span>
      </div>
    </section>
  );
}

export default PublicPreviewCard;
