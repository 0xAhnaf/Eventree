import {
  Banknote,
  Camera,
  ImagePlus,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";

function HighlightsStep({
  profile,
  updateField,
  handleCoverUpload,
  removeCoverImage,
  handlePortfolioUpload,
  removePortfolioImage,
  imageMessage,
}) {
  return (
    <div className="vob-step-content">
      <div className="vob-step-intro">
        <span className="vob-step-icon">
          <Sparkles size={23} />
        </span>
        <div>
          <div className="vob-heading-with-badge">
            <h2>Make your public profile stand out</h2>
            <span>Optional</span>
          </div>
          <p>
            Add these now, skip them, or update them later from Business
            Profile.
          </p>
        </div>
      </div>

      <div className="vob-field-grid vob-three-column-grid">
        <label className="vob-field">
          <span>Years of experience</span>
          <input
            type="number"
            min="0"
            value={profile.yearsExperience}
            onChange={(e) => updateField("yearsExperience", e.target.value)}
            placeholder="Example: 5"
          />
        </label>

        <label className="vob-field">
          <span>Events completed</span>
          <input
            type="number"
            min="0"
            value={profile.eventsCompleted}
            onChange={(e) => updateField("eventsCompleted", e.target.value)}
            placeholder="Example: 120"
          />
        </label>

        <label className="vob-field">
          <span>Starting price</span>
          <div className="vob-input-with-icon">
            <Banknote size={17} />
            <input
              type="number"
              min="0"
              value={profile.startingPrice}
              onChange={(e) => updateField("startingPrice", e.target.value)}
              placeholder="Amount in Taka"
            />
          </div>
        </label>
      </div>

      <div className="vob-media-grid">
        <section className="vob-sub-card">
          <div className="vob-sub-card-heading">
            <span className="vob-small-icon">
              <Camera size={19} />
            </span>
            <div>
              <h3>Cover image</h3>
              <p>Optional · Recommended ratio 16:6</p>
            </div>
          </div>

          {profile.coverImage ? (
            <div className="vob-cover-preview">
              <img src={profile.coverImage} alt="Business cover preview" />
              <button type="button" onClick={removeCoverImage}>
                <Trash2 size={16} />
                Remove
              </button>
            </div>
          ) : (
            <label className="vob-cover-upload">
              <Upload size={23} />
              <strong>Add cover image</strong>
              <span>JPG, PNG or WEBP</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
              />
            </label>
          )}
        </section>

        <section className="vob-sub-card">
          <div className="vob-sub-card-heading">
            <span className="vob-small-icon">
              <ImagePlus size={19} />
            </span>
            <div>
              <h3>Portfolio gallery</h3>
              <p>Optional · Add photos of your work</p>
            </div>
          </div>

          <div className="vob-portfolio-grid">
            {profile.portfolio.map((image, index) => (
              <div
                className="vob-portfolio-item"
                key={`${index}-${image.slice(-20)}`}
              >
                <img src={image} alt={`Portfolio ${index + 1}`} />
                <button
                  type="button"
                  aria-label={`Remove portfolio image ${index + 1}`}
                  onClick={() => removePortfolioImage(index)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            <label className="vob-portfolio-upload">
              <ImagePlus size={21} />
              <span>Add photos</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePortfolioUpload}
              />
            </label>
          </div>
        </section>
      </div>

      {imageMessage && <p className="vob-inline-message">{imageMessage}</p>}

      <p className="vob-storage-note">
        Images are optional. You can skip them now and add or replace them later
        from Business Profile.
      </p>
    </div>
  );
}

export default HighlightsStep;