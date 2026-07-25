import React from "react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

import "./PaymentAlerts.css";


const formatCurrency = (value) => {

  return `৳${value.toLocaleString("en-BD")}`;

};



const PaymentAlerts = () => {


  const payments = [

    {
      title: "Pending Vendor Payout",
      amount: 2450,
      status: "Pending",
      icon: <Clock size={18} />,
      type: "pending",
    },


    {
      title: "Refund Request",
      amount: 680,
      status: "Review",
      icon: <AlertCircle size={18} />,
      type: "review",
    },


    {
      title: "Payment Completed",
      amount: 1250,
      status: "Completed",
      icon: <CheckCircle size={18} />,
      type: "success",
    },


    {
      title: "Failed Transaction",
      amount: 320,
      status: "Failed",
      icon: <XCircle size={18} />,
      type: "failed",
    },

  ];



  return (

    <div className="payment-alerts">


      <div className="payment-alert-header">

        <h3>
          Payment Alerts
        </h3>

        <p>
          Recent payment activities
        </p>

      </div>



      <div className="payment-alert-list">


        {payments.map((payment, index) => (

          <div
            className="payment-alert-item"
            key={index}
          >


            <div className={`payment-alert-icon ${payment.type}`}>

              {payment.icon}

            </div>



            <div className="payment-alert-content">

              <h4>
                {payment.title}
              </h4>


              <span>
                {formatCurrency(payment.amount)}
              </span>

            </div>



            <div className={`payment-status ${payment.type}`}>

              {payment.status}

            </div>


          </div>

        ))}


      </div>


    </div>

  );

};


export default PaymentAlerts;