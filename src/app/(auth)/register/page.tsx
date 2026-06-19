import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create your Blue Fox account — enter your details, accept the Terms & Conditions, and start investing in AI trading robots.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
