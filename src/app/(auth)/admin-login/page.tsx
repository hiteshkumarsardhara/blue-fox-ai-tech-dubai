import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Staff login",
  description: "Sign in to the Blue Fox AI Tech Solutions admin panel.",
};

export default function AdminLoginPage() {
  return (
    <div className="w-full">
      <div className="mx-auto mb-4 flex w-full max-w-md items-center justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
          <ShieldCheck className="h-3.5 w-3.5" /> Admin / Staff
        </span>
      </div>
      <LoginForm
        title="Staff login"
        subtitle="Sign in to the Blue Fox admin panel."
        showSignup={false}
      />
    </div>
  );
}
