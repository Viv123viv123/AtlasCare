import React from "react";
import { SignIn } from "@clerk/clerk-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-emerald-50 px-4 py-8">
      <SignIn
        routing="hash"
        fallbackRedirectUrl="/auth/complete"
        forceRedirectUrl="/auth/complete"
      />
    </main>
  );
}
