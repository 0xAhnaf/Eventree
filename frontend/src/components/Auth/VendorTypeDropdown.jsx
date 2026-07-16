import "../../pages/SignUp/SignUp.css";

function VendorTypeDropdown({
  value,
  onChange,
  required = false,
}) {
  return (
    <div className="vendor-dropdown">
      <label htmlFor="vendorType">Vendor Type</label>

      <select
        id="vendorType"
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">Select Vendor Type</option>
        <option value="caterer">Caterer</option>
        <option value="event-manager">Event Manager</option>
        <option value="photographer-videographer">
          Photographer & Videographer
        </option>
        <option value="music">Music & Entertainment</option>
        <option value="venue">Event Venue</option>
        <option value="decorator">Decorator</option>
      </select>
    </div>
  );
}

export default VendorTypeDropdown;