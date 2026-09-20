import React, { useState, useEffect } from "react";
import { toggleFavoriteApi } from "../../../../services/favoritesApi";
import "./VendorHeader.css";

const VendorHeader = ({ vendor }) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync state with incoming vendor object
  useEffect(() => {
    if (vendor) {
      setSaved(Boolean(vendor.is_favorited || vendor.saved));
    }
  }, [vendor]);

  // Handle Save / Unsave via backend API
  const handleToggleSave = async () => {
    if (!vendor?.id || saving) return;

    try {
      setSaving(true);
      const response = await toggleFavoriteApi(vendor.id);
      
      // Update state based on backend response, or fall back to toggling state
      if (typeof response?.favorited === "boolean") {
        setSaved(response.favorited);
      } else {
        setSaved((prev) => !prev);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      alert("Failed to update saved status. Please check if you are logged in.");
    } finally {
      setSaving(false);
    }
  };

  // Handle Share functionality
  const handleShare = async () => {
    const shareUrl = vendor?.id 
      ? `${window.location.origin}/browse-vendor/${vendor.id}` 
      : window.location.href;

    const shareData = {
      title: vendor?.name || "EVENTREE Vendor",
      text: `Check out ${vendor?.name || "this vendor"} on EVENTREE!`,
      url: shareUrl,
    };

    // 1. Mobile / Supported Browsers: Native Share Menu
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name === "AbortError") return; // User closed share window
      }
    }

    // 2. Desktop Fallback: Copy link to clipboard
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy link:", err);
      alert("Failed to copy link.");
    }
  };

  return (
    <section className="vendor-header">
      <div className="vendor-header-container">
        <div className="vendor-info">
          {vendor?.verified && (
            <div className="verified-badge">✓ Verified Vendor</div>
          )}

          <h1>{vendor?.name}</h1>

          <p className="vendor-category">{vendor?.category}</p>

          <div className="vendor-meta">
            <span>📍 {vendor?.location}</span>

            <span className="rating">
              {vendor?.rating == null
                ? "No reviews yet"
                : `⭐ ${vendor.rating} (${vendor.reviewCount || 0} Reviews)`}
            </span>
          </div>
        </div>

        <div className="vendor-actions">
          <button 
            type="button" 
            onClick={handleShare}
            className={copied ? "copied" : ""}
          >
            {copied ? "✓ Copied!" : "↗ Share"}
          </button>

          <button 
            type="button" 
            onClick={handleToggleSave}
            disabled={saving}
            className={saved ? "saved-btn" : ""}
          >
            {saving ? "Saving..." : saved ? "♥ Saved" : "♡ Save"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default VendorHeader;