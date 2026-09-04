import { Banknote, Check, Plus, Trash2 } from "lucide-react";

function ServicesStep({
  profile,
  amenityInput,
  setAmenityInput,
  addAmenity,
  removeAmenity,
  addPackage,
  updatePackage,
  updatePackageFeatures,
  removePackage,
}) {
  return (
    <div className="vob-step-content">
      <div className="vob-step-intro">
        <span className="vob-step-icon">
          <Check size={23} />
        </span>
        <div>
          <div className="vob-heading-with-badge">
            <h2>Add services and pricing packages</h2>
            <span>Optional</span>
          </div>
          <p>
            Both sections can be skipped now and completed later from Business
            Profile.
          </p>
        </div>
      </div>

      <section className="vob-sub-card vob-service-card">
        <div className="vob-sub-card-heading">
          <span className="vob-small-icon">
            <Check size={19} />
          </span>
          <div>
            <h3>Key amenities and services</h3>
            <p>Add one service at a time.</p>
          </div>
        </div>

        <div className="vob-add-row">
          <input
            type="text"
            value={amenityInput}
            onChange={(e) => setAmenityInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addAmenity();
              }
            }}
            placeholder="Example: On-site parking"
          />
          <button type="button" onClick={addAmenity}>
            <Plus size={17} />
            Add amenity
          </button>
        </div>

        {profile.amenities.length ? (
          <div className="vob-chip-list">
            {profile.amenities.map((amenity) => (
              <span className="vob-chip" key={amenity}>
                <Check size={14} />
                {amenity}
                <button
                  type="button"
                  aria-label={`Remove ${amenity}`}
                  onClick={() => removeAmenity(amenity)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="vob-empty-message">No amenities added yet.</p>
        )}
      </section>

      <section className="vob-sub-card vob-package-section">
        <div className="vob-package-section-heading">
          <div className="vob-sub-card-heading">
            <span className="vob-small-icon">
              <Banknote size={19} />
            </span>
            <div>
              <h3>Pricing packages</h3>
              <p>Add up to three packages.</p>
            </div>
          </div>

          {profile.packages.length < 3 && (
            <button
              type="button"
              className="vob-add-package-button"
              onClick={addPackage}
            >
              <Plus size={17} />
              Add package ({profile.packages.length}/3)
            </button>
          )}
        </div>

        {profile.packages.length ? (
          <div className="vob-package-grid">
            {profile.packages.map((packageItem, packageIndex) => (
              <article className="vob-package-card" key={packageItem.id}>
                <div className="vob-package-header">
                  <span>Package {packageIndex + 1}</span>
                  <button
                    type="button"
                    aria-label={`Remove package ${packageIndex + 1}`}
                    onClick={() => removePackage(packageIndex)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <label className="vob-field">
                  <span>Package name</span>
                  <input
                    type="text"
                    value={packageItem.name}
                    onChange={(e) =>
                      updatePackage(packageIndex, "name", e.target.value)
                    }
                    placeholder="Example: General Package"
                  />
                </label>

                <label className="vob-field">
                  <span>Package price</span>
                  <input
                    type="number"
                    min="0"
                    value={packageItem.price}
                    onChange={(e) =>
                      updatePackage(packageIndex, "price", e.target.value)
                    }
                    placeholder="Amount in Taka"
                  />
                </label>

                <label className="vob-field">
                  <span>Package features</span>
                  <textarea
                    rows="5"
                    value={packageItem.features.join("\n")}
                    onChange={(e) =>
                      updatePackageFeatures(packageIndex, e.target.value)
                    }
                    placeholder="Write one feature per line"
                  />
                </label>
              </article>
            ))}
          </div>
        ) : (
          <div className="vob-empty-package">
            <Banknote size={26} />
            <p>No pricing packages added.</p>
            <span>You can add them now or later from Business Profile.</span>
          </div>
        )}
      </section>
    </div>
  );
}

export default ServicesStep;
