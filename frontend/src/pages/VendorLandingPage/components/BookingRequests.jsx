import { useState } from "react";
import { Check, X } from "lucide-react";
import "./BookingRequests.css";

const defaultRequests = [
  {
    id: 1,
    initials: "EM",
    name: "Eleanor Maxwell",
    eventType: "Floral Arrangement Workshop",
    date: "Nov 04, 2026",
    pkg: "Bespoke Full Service",
  },
  {
    id: 2,
    initials: "JT",
    name: "Julian Thorne",
    eventType: "Private Art Soirée",
    date: "Oct 29, 2026",
    pkg: "Evening Curated",
  },
  {
    id: 3,
    initials: "RC",
    name: "Renata Cole",
    eventType: "Rooftop Anniversary Dinner",
    date: "Nov 09, 2026",
    pkg: "Signature Intimate",
  },
];

function BookingRequests({ requests: initialRequests = defaultRequests }) {
  const [requests, setRequests] = useState(initialRequests);

  const handleDecline = (id) => {
    setRequests((prev) => prev.filter((request) => request.id !== id));
  };

  const handleAccept = (id) => {
    setRequests((prev) => prev.filter((request) => request.id !== id));
  };

  return (
    <div className="booking-requests-VLP">
      <div className="booking-requests-header-VLP">
        <h4 className="booking-requests-title-VLP">New Booking Requests</h4>
        <span className="booking-requests-badge-VLP">{requests.length} Pending</span>
      </div>

      <div className="booking-requests-table-wrap-VLP">
        <table className="booking-requests-table-VLP">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Event Type</th>
              <th>Date Requested</th>
              <th>Package</th>
              <th className="booking-requests-action-col-VLP">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>
                  <div className="booking-client-VLP">
                    <span className="booking-avatar-VLP">{request.initials}</span>
                    <span className="booking-client-name-VLP">{request.name}</span>
                  </div>
                </td>
                <td className="booking-cell-muted-VLP">{request.eventType}</td>
                <td className="booking-cell-muted-VLP">{request.date}</td>
                <td>
                  <span className="booking-package-VLP">{request.pkg}</span>
                </td>
                <td>
                  <div className="booking-actions-VLP">
                    <button
                      className="booking-action-btn-VLP booking-action-decline-VLP"
                      onClick={() => handleDecline(request.id)}
                      aria-label="Decline booking"
                    >
                      <X size={18} />
                    </button>
                    <button
                      className="booking-action-btn-VLP booking-action-accept-VLP"
                      onClick={() => handleAccept(request.id)}
                      aria-label="Accept booking"
                    >
                      <Check size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {requests.length === 0 && (
              <tr>
                <td colSpan="5" className="booking-empty-VLP">
                  No pending booking requests right now.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingRequests;
