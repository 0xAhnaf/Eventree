import "./VendorCard.css";

export default function VendorCard({ vendor }) {
  return (
    <div className={`vendor-card-CLP ${vendor.featured ? "featured" : ""}`}>

      {vendor.featured && (
        <span className="featured-badge-CLP">Featured</span>
      )}

      <div className="image-wrapper-CLP">
        <img src={vendor.image} alt={vendor.name} />

        <div className="overlay-CLP">
          <button>View Portfolio</button>
        </div>
      </div>

      <div className="vendor-content-CLP">

        <div className="vendor-header-CLP">
          <h3>{vendor.name}</h3>

          <span className="rating-CLP">
            ⭐ {vendor.rating}
          </span>
        </div>

        <p className="location-CLP">
          {vendor.category} • {vendor.location}
        </p>

       <p className={`verified-CLP ${!vendor.verified ? "hidden-CLP" : ""}`}>
              ✔ Verified Vendor
       </p>

        <div className="price-row-CLP">

          <span>Starting at</span>

          <strong>{vendor.price}</strong>

        </div>

      </div>

    </div>
  );
}