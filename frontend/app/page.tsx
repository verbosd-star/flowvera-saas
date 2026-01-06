'use client';

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center py-32 px-8 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-8 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-black dark:text-zinc-50">
            Welcome to Flowvera
          </h1>
          <p className="max-w-2xl text-xl leading-8 text-zinc-600 dark:text-zinc-400">
            Projects. Clients. Growth. All-in-one SaaS platform that combines project management with an integrated CRM.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
            <Link
              href="/register"
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-8 text-white font-medium transition-colors hover:bg-blue-700"
            >
              Get Started
            </Link>
            <Link
              href="/pricing"
              className="flex h-12 items-center justify-center rounded-full border border-solid border-blue-600 px-8 text-blue-600 dark:text-blue-400 font-medium transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              View Pricing
            </Link>
            <Link
              href="/login"
              className="flex h-12 items-center justify-center rounded-full border border-solid border-zinc-300 dark:border-zinc-700 px-8 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-900 dark:text-white"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
              <div className="text-3xl mb-4">🗂️</div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                Visual Project Boards
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                Organize your work with intuitive, Monday-style project management.
              </p>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                Built-in CRM
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                Manage clients and relationships in one integrated platform.
              </p>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
              <div className="text-3xl mb-4">🔐</div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                Secure Authentication
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                Enterprise-grade security with JWT and role-based access control.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
