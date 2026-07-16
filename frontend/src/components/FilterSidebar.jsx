import "./FilterSidebar.css";

export default function FilterSidebar() {
  return (
    <aside className="filter-sidebar-CLP">

      <div className="filter-box-CLP">

        <h3>Filters</h3>

        {/* Category */}
        <div className="filter-group-CLP">
          <label className="filter-title">Category</label>

          <label>
            <input type="checkbox" defaultChecked />
            All Services
          </label>

          <label>
            <input type="checkbox" />
            Venues
          </label>

          <label>
            <input type="checkbox" />
            Catering
          </label>

          <label>
            <input type="checkbox" />
            Floral Design
          </label>

          <label>
            <input type="checkbox" />
            Photography
          </label>
        </div>

        <hr />

        {/* Price */}
        <div className="filter-group-CLP">
          <label className="filter-title-CLP">Price Range</label>

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

          <label className="filter-title-CLP">Minimum Rating</label>

          <div className="rating-buttons-CLP">

            <button>4.5+</button>

            <button>4.0+</button>

            <button>3.5+</button>

          </div>

        </div>

        <hr />

        {/* Availability */}
        <div className="filter-group-CLP">

          <label className="filter-title-CLP">Availability</label>

          <input type="date" />

        </div>

        <button className="apply-btn-CLP">
          Apply Filters
        </button>

      </div>

    </aside>
  );
}