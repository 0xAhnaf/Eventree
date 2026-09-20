import React, { useState, useEffect } from "react";
import { fetchFavorites, toggleFavoriteApi } from "../../services/favoritesApi";
import VendorCard from "../../components/VendorCard";
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

  if (loading) return <div className="favorites-page"><p>Loading saved vendors...</p></div>;
  if (error) return <div className="favorites-page"><p className="error-text">{error}</p></div>;

  return (
    <div className="favorites-page">
      <div className="favorites-container">
        <h2>Saved Vendors ({favorites.length})</h2>

        {favorites.length === 0 ? (
          <div className="empty-favorites">
            <p>You haven't saved any vendors to your favorites yet.</p>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((vendor) => (
              <div key={vendor.id} className="favorite-card-wrapper" style={{ position: "relative" }}>
                <button
                  className="remove-favorite-btn"
                  onClick={() => handleRemove(vendor.id)}
                  title="Remove from favorites"
                >
                  ✕
                </button>
                <VendorCard vendor={vendor} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavouritePage;