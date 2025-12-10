import React, { useState } from "react";
import StudentPay from "../../components/StudentPay/StudentPay.jsx";
import Invoices from "../../components/Invoices/Invoices.jsx";
import Payslips from "../../components/PayslipGenerator/PayslipGenerator.jsx";
import "../style.css";

const FinanceManagement = () => {
  const [tab, setTab] = useState("pay");


  const renderTab = () => {
    switch (tab) {
      // case "notifications": return <PaymentNotifications />;
      case "pay": return <StudentPay />;
      case "invoices": return <Invoices />;
      case "payslips": return <Payslips />;
      default: return <StudentPay />;
    }
  };

  return (
    <div className="manage-container">
      <h2 className="title">Finance Management 💰</h2>

      {/* TAB NAVIGATION */}
      <div className="tab-nav">
        
        <div className="tabs">
          <span
            className="tab-indicator"
            style={{
              left: 
                tab === "pay" ? "0%" :
                  tab === "invoices" ? "33.33%" :
                    "66.66%"
            }}
          />

          <button
            className={tab === "pay" ? "active" : ""}
            onClick={() => setTab("pay")}
          >
            💳 Payments
          </button>

          <button
            className={tab === "invoices" ? "active" : ""}
            onClick={() => setTab("invoices")}
          >
            📄 Invoices
          </button>

          <button
            className={tab === "payslips" ? "active" : ""}
            onClick={() => setTab("payslips")}
          >
            🧾 Payslips
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="tab-body slide-container">
        <div key={tab} className="slide-content">
          {renderTab()}
        </div>
      </div>
    </div>
  );
};

export default FinanceManagement;
