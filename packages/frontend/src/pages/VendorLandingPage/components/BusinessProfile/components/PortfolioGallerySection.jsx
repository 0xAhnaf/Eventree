import { Camera, ImagePlus, Trash2 } from "lucide-react";
import ProfileSectionHeading from "./ProfileSectionHeading.jsx";

function PortfolioGallerySection({
  portfolio,
  coverImageId,
  onUpload,
  onRemove,
  onSetCover,
}) {
  const countBadge = <span className="vbp-count-badge">{portfolio.length} images</span>;

  return (
    <section className="vbp-card">
      <ProfileSectionHeading
        icon={ImagePlus}
        title="Portfolio gallery"
        description="Add portfolio images for the public Vendor Portfolio section. There is no fixed image-count limit in this frontend form."
        action={countBadge}
      />

      <div className="vbp-portfolio-grid">
        {portfolio.map((image, imageIndex) => {
          const isCover = String(coverImageId) === String(image.id);

          return (
            <div
              className={`vbp-portfolio-item${isCover ? " is-cover" : ""}`}
              key={image.id}
            >
              <img src={image.url} alt={`Portfolio preview ${imageIndex + 1}`} />

              <button
                type="button"
                className="vbp-portfolio-cover-action"
                aria-label={
                  isCover
                    ? `Portfolio image ${imageIndex + 1} is the cover image`
                    : `Set portfolio image ${imageIndex + 1} as cover`
                }
                onClick={() => !isCover && onSetCover(image)}
                disabled={isCover}
              >
                <Camera size={15} />
                {isCover ? "Cover image" : "Set as cover"}
              </button>

              <button
                type="button"
                className="vbp-portfolio-delete"
                aria-label={`Remove portfolio image ${imageIndex + 1}`}
                onClick={() => onRemove(image.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}

        <label className="vbp-portfolio-upload">
          <ImagePlus size={26} />
          <strong>Add photos</strong>
          <span>JPG, PNG or WEBP</span>
          <input type="file" accept="image/*" multiple onChange={onUpload} />
        </label>
      </div>
    </section>
  );
}

export default PortfolioGallerySection;
