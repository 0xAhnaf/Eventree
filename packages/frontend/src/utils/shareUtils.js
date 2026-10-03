/**
 * Shares a link using the Web Share API or falls back to Clipboard Copy.
 */
export const handleShare = async ({ title, text, path }) => {
  // Uses window.location.origin to dynamically adapt to localhost or live domain
  const shareUrl = path 
    ? `${window.location.origin}${path}` 
    : window.location.href;

  const shareData = {
    title: title || "EVENTREE",
    text: text || "Check this out on EVENTREE!",
    url: shareUrl,
  };

  // 1. Mobile & Web Share API supported browsers
  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return { success: true, message: "Shared successfully!" };
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Share error:", err);
      }
      return { success: false, message: "Share cancelled or failed." };
    }
  }

  // 2. Desktop Fallback: Copy link to clipboard
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(shareUrl);
    } else {
      // Legacy fallback
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }

    alert("Link copied to clipboard!");
    return { success: true, message: "Copied to clipboard!" };
  } catch (err) {
    console.error("Clipboard copy error:", err);
    alert("Could not copy link.");
    return { success: false, message: "Failed to copy." };
  }
};