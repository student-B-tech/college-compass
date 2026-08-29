"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  async function checkAuth() {
    try {
      const response = await fetch("/api/auth/me", {
        cache: "no-store",
      });

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();

      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      alert("Unable to logout. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
            C
          </div>

          <span className="text-xl font-bold text-slate-900">
            College Compass
          </span>
        </Link>

        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/"
            className="font-medium text-slate-600 hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            href="/#colleges"
            className="hidden font-medium text-slate-600 hover:text-blue-600 sm:block"
          >
            Colleges
          </Link>

          <Link
            href="/compare"
            className="font-medium text-slate-600 hover:text-blue-600"
          >
            Compare
          </Link>

          <Link
            href="/saved"
            className="font-medium text-slate-600 hover:text-blue-600"
          >
            Saved
          </Link>

          {!loading && user ? (
            <>
              <span className="hidden font-semibold text-slate-700 md:block">
                Hi, {user.name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : !loading ? (
            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
            >
              Login
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}