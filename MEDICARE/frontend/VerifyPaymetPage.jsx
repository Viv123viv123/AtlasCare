import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search || "");
    const sessionId = params.get("session_id");

    // User cancelled on Stripe
    if (location.pathname === "/appointment/cancel") {
      navigate("/appointments?payment_status=Cancelled", { replace: true });
      return;
    }

    if (!sessionId) {
      navigate("/appointments?payment_status=Failed", { replace: true });
      return;
    }

    // Payment status is updated server-to-server by Stripe Webhook
    navigate("/appointments?payment_status=Paid", { replace: true });
  }, [location, navigate]);

  return null;
};

export default VerifyPaymentPage;