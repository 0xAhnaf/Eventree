import React from "react";
import { CheckCircle } from "lucide-react";

import "./PaymentAlerts.css";

const formatCurrency = (value) => {
  return `৳${value.toLocaleString("en-BD")}`;
};

const PaymentAlerts = ({ payments = [] }) => {

  return (
    <div className="payment-alerts">
      <div className="payment-alert-header">
        <h3>Payment Alerts</h3>

        <p>Recent payment activities</p>
      </div>

      <div className="payment-alert-list">
        {!payments.length && (
          <p className="payment-alert-empty">No completed registration payments yet.</p>
        )}
        {payments.map((payment) => (
          <div className="payment-alert-item" key={payment.id}>
            <div className="payment-alert-icon success">
              <CheckCircle size={18} />
            </div>

            <div className="payment-alert-content">
              <h4>{payment.businessName}</h4>

              <span>{formatCurrency(payment.amount)}</span>
            </div>

            <div className="payment-status success">
              Completed
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentAlerts;
