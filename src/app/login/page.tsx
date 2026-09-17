import { Suspense } from "react";
import { LoginForm } from "@/components/shared/auth-forms";

export default function LoginPage() {
  return (
    <div className="px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
