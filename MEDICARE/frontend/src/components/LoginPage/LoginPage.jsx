import React from "react";
import { SignIn } from "@clerk/clerk-react";

export default function LoginPage() {
  return (
    <SignIn
      routing="hash"
      fallbackRedirectUrl="/auth/complete"
      forceRedirectUrl="/auth/complete"
    />
  );
}
