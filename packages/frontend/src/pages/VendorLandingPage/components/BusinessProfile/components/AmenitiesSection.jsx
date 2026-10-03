import { Check, Plus, X } from "lucide-react";
import ProfileSectionHeading from "./ProfileSectionHeading.jsx";

function AmenitiesSection({
  amenities,
  suggestions,
  categoryName,
  input,
  onInputChange,
  onAdd,
  onAddSuggestion,
  onRemove,
}) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onAdd();
    }
  };

  return (
    <section className="vbp-card">
      <ProfileSectionHeading
        icon={Check}
        title="Key amenities and services"
        description="These appear beneath the portfolio gallery on the public vendor page."
      />

      <div className="vbp-amenity-suggestions">
        <div className="vbp-amenity-suggestions-heading">
          <strong>Suggested for {categoryName || "your category"}</strong>
          <span>Click to add</span>
        </div>

        <div className="vbp-amenity-suggestion-list">
          {suggestions.map((suggestion) => {
            const isAdded = amenities.some(
              (amenity) => amenity.toLowerCase() === suggestion.toLowerCase(),
            );

            return (
              <button
                type="button"
                className="vbp-amenity-suggestion"
                key={suggestion}
                onClick={() => onAddSuggestion(suggestion)}
                disabled={isAdded}
              >
                {isAdded ? <Check size={14} /> : <Plus size={14} />}
                {suggestion}
              </button>
            );
          })}
        </div>
      </div>

      <div className="vbp-amenity-add">
        <input
          type="text"
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type another amenity"
        />

        <button type="button" onClick={onAdd}>
          <Plus size={17} />
          Add amenity
        </button>
      </div>

      <div className="vbp-amenity-list">
        {amenities.map((amenity) => (
          <span className="vbp-amenity-chip" key={amenity}>
            <Check size={15} />
            {amenity}
            <button
              type="button"
              aria-label={`Remove ${amenity}`}
              onClick={() => onRemove(amenity)}
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
    </section>
  );
}

export default AmenitiesSection;
