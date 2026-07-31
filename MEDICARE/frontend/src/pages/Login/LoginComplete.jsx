import React, { useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function LoginComplete() {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      navigate("/login", { replace: true });
      return;
    }

    let cancelled = false;
    const resolveDestination = async () => {
      const token = await getToken();
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"}/api/doctors/me`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const result = await response.json().catch(() => null);

      if (cancelled) return;
      if (response.ok && result?.data?._id) {
        navigate(`/doctor-admin/${result.data._id}`, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    };

    resolveDestination().catch(() => {
      if (!cancelled) navigate("/", { replace: true });
    });

    return () => {
      cancelled = true;
    };
  }, [getToken, isLoaded, isSignedIn, navigate]);

  return <div className="min-h-screen" />;
}