import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your Blue Fox client portal.",
};

export default function LoginPage() {
  return <LoginForm />;
}
