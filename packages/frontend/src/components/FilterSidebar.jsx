import { useEffect, useState } from "react";
import "./FilterSidebar.css";

const categories = [
  "Caterers",
  "Event Venues",
  "Decorations",
  "Photography & Videography",
  "Event Management",
];

const ratingOptions = [4.5, 4.0, 3.5];

const PRICE_MIN = 500;
const PRICE_MAX = 50000;

const formatPrice = (value) => `$${Number(value).toLocaleString("en-US")}`;

export default function FilterSidebar({
  selectedCategories,
  onCategoryChange,
  onAllServices,
  priceMax = PRICE_MAX,
  minRating = 0,
  availabilityDate = "",
  onApply,
}) {
  const allServicesSelected = selectedCategories.length === 0;

  // Price, rating, and availability are "draft" until Apply Filters is
  // clicked, matching the button's purpose. Category checkboxes still
  // apply instantly, same as before.
  const [draftPrice, setDraftPrice] = useState(priceMax);
  const [draftRating, setDraftRating] = useState(minRating);
  const [draftAvailability, setDraftAvailability] = useState(availabilityDate);

  // Keep the draft values in sync if the applied filters change elsewhere
  // (e.g. a "reset" action from the parent).
  useEffect(() => {
    setDraftPrice(priceMax);
  }, [priceMax]);

  useEffect(() => {
    setDraftRating(minRating);
  }, [minRating]);

  useEffect(() => {
    setDraftAvailability(availabilityDate);
  }, [availabilityDate]);

  const toggleRating = (value) => {
    setDraftRating((current) => (current === value ? 0 : value));
  };

  const handleApply = () => {
    onApply?.({
      priceMax: draftPrice,
      minRating: draftRating,
      availabilityDate: draftAvailability,
    });
  };

  return (
    <aside className="filter-sidebar-CLP">
      <div className="filter-box-CLP">
        <h3>Filters</h3>

        {/* Category */}
        <div className="filter-group-CLP">
          <label className="filter-title">Category</label>

          <label>
            <input
              type="checkbox"
              checked={allServicesSelected}
              onChange={onAllServices}
            />
            All Services
          </label>

          {categories.map((category) => (
            <label key={category}>
              <input
                type="checkbox"
                value={category}
                checked={selectedCategories.includes(category)}
                onChange={() => onCategoryChange(category)}
              />

              {category}
            </label>
          ))}
        </div>

        <hr />

        {/* Price */}
        <div className="filter-group-CLP">
          <label className="filter-title-CLP">Price Range</label>

          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step="100"
            value={draftPrice}
            onChange={(event) => setDraftPrice(Number(event.target.value))}
          />

          <div className="price-values-CLP">
            <span>{formatPrice(PRICE_MIN)}</span>
            <span>
              {draftPrice >= PRICE_MAX
                ? `${formatPrice(PRICE_MAX)}+`
                : `Up to ${formatPrice(draftPrice)}`}
            </span>
          </div>
        </div>

        <hr />

        {/* Rating */}
        <div className="filter-group-CLP">
          <label className="filter-title-CLP">Minimum Rating</label>

          <div className="rating-buttons-CLP">
            {ratingOptions.map((value) => (
              <button
                key={value}
                type="button"
                className={draftRating === value ? "rating-active-CLP" : ""}
                aria-pressed={draftRating === value}
                onClick={() => toggleRating(value)}
              >
                {value.toFixed(1)}+
              </button>
            ))}
          </div>
        </div>

        <hr />

        {/* Availability */}
        <div className="filter-group-CLP">
          <label className="filter-title-CLP">Availability</label>

          <input
            type="date"
            value={draftAvailability}
            onChange={(event) => setDraftAvailability(event.target.value)}
          />
        </div>

        <button type="button" className="apply-btn-CLP" onClick={handleApply}>
          Apply Filters
        </button>
      </div>
    </aside>
  );
}
