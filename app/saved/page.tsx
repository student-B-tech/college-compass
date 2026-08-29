"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type College = {
  id: number;
  name: string;
  location: string;
  type: string;
  course: string;
  fees: string;
  rating: number;
  placement: string;
};

const SAVED_KEY = "savedColleges";

export default function SavedCollegesPage() {
  const [savedColleges, setSavedColleges] = useState<College[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setSavedColleges(parsed);
        }
      }
    } catch (error) {
      console.error("Error loading saved colleges:", error);
    }
  }, []);

  function removeSaved(id: number) {
    const updated = savedColleges.filter(
      (college) => college.id !== id
    );

    setSavedColleges(updated);

    localStorage.setItem(
      SAVED_KEY,
      JSON.stringify(updated)
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* NAVBAR */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">

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

          <Link
            href="/"
            className="font-medium text-slate-600 hover:text-blue-600"
          >
            Home
          </Link>

        </div>
      </nav>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-4 py-12">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            ❤️ Saved Colleges
          </h1>

          <p className="mt-2 text-slate-500">
            Colleges you have saved for later.
          </p>
        </div>

        {/* EMPTY STATE */}
        {savedColleges.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

            <div className="text-5xl">
              ♡
            </div>

            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              No Saved Colleges
            </h2>

            <p className="mt-2 text-slate-500">
              Save colleges from the home page to see them here.
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Explore Colleges
            </Link>

          </div>
        )}

        {/* SAVED COLLEGES */}
        {savedColleges.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {savedColleges.map((college) => (
              <article
                key={college.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">

                  <div className="flex items-start justify-between gap-3">

                    <h2 className="text-xl font-bold">
                      {college.name}
                    </h2>

                    <span className="rounded-lg bg-white/20 px-2 py-1 text-sm">
                      ⭐ {college.rating}
                    </span>

                  </div>

                  <p className="mt-2 text-sm text-blue-100">
                    📍 {college.location}
                  </p>

                </div>

                <div className="p-6">

                  <div className="space-y-3 text-sm">

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Type
                      </span>

                      <span className="font-semibold text-slate-800">
                        {college.type}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Course
                      </span>

                      <span className="font-semibold text-slate-800">
                        {college.course}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Fees
                      </span>

                      <span className="font-semibold text-slate-800">
                        {college.fees}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Placement
                      </span>

                      <span className="font-semibold text-slate-800">
                        {college.placement}
                      </span>
                    </div>

                  </div>

                  <div className="mt-6 flex gap-3">

                    <Link
                      href={`/college/${college.id}`}
                      className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700"
                    >
                      View Details
                    </Link>

                    <button
                      type="button"
                      onClick={() => removeSaved(college.id)}
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-600 hover:bg-red-100"
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </article>
            ))}

          </div>
        )}

      </section>

    </main>
  );
}