import React, { useState, useEffect } from "react";
import { fetchFavorites, toggleFavoriteApi } from "../../services/favoritesApi";
import VendorCard from "../../components/VendorCard";
import { CustomerDashboardLayout } from "../../components/CustomerDashboard";
import "./FavouritePage.css";

const FavouritePage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await fetchFavorites();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load saved vendors.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (vendorId) => {
    try {
      setFavorites((prev) => prev.filter((v) => v.id !== vendorId));
      await toggleFavoriteApi(vendorId);
    } catch (err) {
      console.error(err);
      loadFavorites(); // Revert state on failure
    }
  };

  return (
    <CustomerDashboardLayout
      className="favorites-page"
      contentClassName="favorites-main"
    >
      <div className="favorites-container">
        <div className="favorites-header">
          <div>
            <p className="favorites-eyebrow">YOUR COLLECTION</p>
            <h2>
              Saved Vendors <span>({favorites.length})</span>
            </h2>
            <p className="favorites-description">
              Keep your favorite event professionals close at hand.
            </p>
          </div>
        </div>

        {loading ? (
          <p role="status" className="favorites-message">
            Loading saved vendors...
          </p>
        ) : error ? (
          <p className="favorites-message error-text" role="alert">
            {error}
          </p>
        ) : favorites.length === 0 ? (
          <div className="empty-favorites">
            <div className="empty-favorites-icon">♡</div>
            <h3>No saved vendors yet</h3>
            <p>
              You haven't saved any vendors to your favorites yet. Explore
              vendors and save the ones you love.
            </p>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((vendor) => (
              <div key={vendor.id} className="favorite-card-wrapper">
                <button
                  type="button"
                  className="remove-favorite-btn"
                  onClick={() => handleRemove(vendor.id)}
                  title="Remove from favorites"
                  aria-label={`Remove ${vendor.name || "vendor"} from favorites`}
                >
                  ✕
                </button>
                <VendorCard vendor={vendor} />
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerDashboardLayout>
  );
};

export default FavouritePage;
