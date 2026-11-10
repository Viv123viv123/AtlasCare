import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyServicePaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search || "");
    const sessionId = params.get("session_id");

    if (location.pathname === "/service-appointment/cancel") {
      navigate("/appointments?service_payment=Cancelled", {
        replace: true,
      });
      return;
    }

    if (!sessionId) {
      navigate("/appointments?service_payment=Failed", {
        replace: true,
      });
      return;
    }

    // Payment status is updated server-to-server by Stripe Webhook
    navigate("/appointments?service_payment=Paid", {
      replace: true,
    });
  }, [location, navigate]);

  return null;
};

export default VerifyServicePaymentPage;