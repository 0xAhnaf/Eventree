import React from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./VendorWatchlist.css";

const formatCurrency = (value) => {
  return `৳${Number(value || 0).toLocaleString("en-BD")}`;
};

const VendorWatchlist = ({ vendors = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="vendor-watchlist">
      <div className="vendor-watchlist-header">
        <div>
          <h3>Vendor Watchlist</h3>
          <p>Monitor top performing vendors</p>
        </div>

        <button type="button" onClick={() => navigate("/admin/vendors")}>View All</button>
      </div>

      <div className="vendor-table-wrapper">
        <table className="vendor-table">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Category</th>
              <th>Bookings</th>
              <th>Revenue</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {!vendors.length && (
              <tr><td colSpan="5">No approved vendors to display.</td></tr>
            )}
            {vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td className="vendor-name" data-label="Vendor">
                  {vendor.businessName}
                </td>

                <td data-label="Category">{vendor.category}</td>

                <td data-label="Bookings">{vendor.bookings}</td>

                <td data-label="Revenue">{formatCurrency(vendor.revenue)}</td>

                <td data-label="Status">
                  <span className="vendor-status verified">
                    <CheckCircle size={14} />
                    Approved
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorWatchlist;
