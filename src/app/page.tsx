"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Task Board</h1>
          <p className="text-gray-600">
            {isAuthenticated
              ? "Welcome to Home!"
              : "Please sign in first."}
          </p>
        </div>
        <AuthGuard fallback={<LoginForm />}>
          <div className="max-w-4xl mx-auto">
            <h1>This Is private page</h1>
          </div>
        </AuthGuard>
      </div>
    </div>
  );
}
