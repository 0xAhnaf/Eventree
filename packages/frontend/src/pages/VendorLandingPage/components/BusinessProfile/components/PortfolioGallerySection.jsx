import { ImagePlus, Trash2 } from "lucide-react";
import ProfileSectionHeading from "./ProfileSectionHeading.jsx";

function PortfolioGallerySection({ portfolio, onUpload, onRemove }) {
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
        {portfolio.map((image, imageIndex) => (
          <div className="vbp-portfolio-item" key={image.id}>
            <img src={image.url} alt={`Portfolio preview ${imageIndex + 1}`} />

            <button
              type="button"
              aria-label={`Remove portfolio image ${imageIndex + 1}`}
              onClick={() => onRemove(image.id)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

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
