import React, { useState } from "react";
import "./VendorHeader.css";

const VendorHeader = ({ vendor }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Dynamically uses window.location.origin (works on localhost & production domain)
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
                : `⭐ ${vendor.rating} (${vendor.reviewCount} Reviews)`}
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

          <button type="button">♡ Save</button>
        </div>
      </div>
    </section>
  );
};

export default VendorHeader;