import { Banknote, Plus, Trash2 } from "lucide-react";
import ProfileSectionHeading from "./ProfileSectionHeading.jsx";

function PricingPackagesSection({
  packages,
  onAdd,
  onRemove,
  onUpdate,
  onUpdateFeatures,
}) {
  const action =
    packages.length < 3 ? (
      <button type="button" className="vbp-add-package" onClick={onAdd}>
        <Plus size={17} />
        Add package ({packages.length}/3)
      </button>
    ) : (
      <span className="vbp-count-badge">3/3 packages</span>
    );

  return (
    <section className="vbp-card">
      <ProfileSectionHeading
        icon={Banknote}
        title="Pricing packages"
        description="Maintain up to three package names, prices, and feature lists for future public display."
        action={action}
      />

      <div className="vbp-package-grid">
        {packages.map((packageItem, packageIndex) => (
          <article className="vbp-package-card" key={packageItem.id}>
            <div className="vbp-package-header">
              <span>Package {packageIndex + 1}</span>

              {packages.length > 1 && (
                <button
                  type="button"
                  aria-label={`Remove package ${packageIndex + 1}`}
                  onClick={() => onRemove(packageIndex)}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <label className="vbp-field">
              <span>Package name</span>
              <input
                type="text"
                value={packageItem.name}
                onChange={(event) =>
                  onUpdate(packageIndex, "name", event.target.value)
                }
              />
            </label>

            <label className="vbp-field">
              <span>Package price</span>
              <input
                type="number"
                min="0"
                value={packageItem.price}
                onChange={(event) =>
                  onUpdate(packageIndex, "price", event.target.value)
                }
                placeholder="Amount in Taka"
              />
            </label>

            <label className="vbp-field">
              <span>Package features</span>
              <textarea
                rows="6"
                value={packageItem.features.join("\n")}
                onChange={(event) =>
                  onUpdateFeatures(packageIndex, event.target.value)
                }
                placeholder="Write one feature per line"
              />
              <small>Write one feature per line.</small>
            </label>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PricingPackagesSection;
