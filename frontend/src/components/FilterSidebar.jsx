import "./FilterSidebar.css";

const categories = [
  "Caterers",
  "Event Venues",
  "Decorations",
  "Photography & Videography",
  "Event Management",
];

export default function FilterSidebar({
  selectedCategories,
  onCategoryChange,
  onAllServices,
}) {
  const allServicesSelected =
    selectedCategories.length === 0;

  return (
    <aside className="filter-sidebar-CLP">
      <div className="filter-box-CLP">
        <h3>Filters</h3>

        {/* Category */}
        <div className="filter-group-CLP">
          <label className="filter-title">
            Category
          </label>

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
                checked={selectedCategories.includes(
                  category
                )}
                onChange={() =>
                  onCategoryChange(category)
                }
              />

              {category}
            </label>
          ))}
        </div>

        <hr />

        {/* Price */}
        <div className="filter-group-CLP">
          <label className="filter-title-CLP">
            Price Range
          </label>

          <input
            type="range"
            min="500"
            max="50000"
            defaultValue="25000"
          />

          <div className="price-values-CLP">
            <span>$500</span>
            <span>$50,000+</span>
          </div>
        </div>

        <hr />

        {/* Rating */}
        <div className="filter-group-CLP">
          <label className="filter-title-CLP">
            Minimum Rating
          </label>

          <div className="rating-buttons-CLP">
            <button type="button">4.5+</button>
            <button type="button">4.0+</button>
            <button type="button">3.5+</button>
          </div>
        </div>

        <hr />

        {/* Availability */}
        <div className="filter-group-CLP">
          <label className="filter-title-CLP">
            Availability
          </label>

          <input type="date" />
        </div>

        <button
          type="button"
          className="apply-btn-CLP"
        >
          Apply Filters
        </button>
      </div>
    </aside>
  );
}