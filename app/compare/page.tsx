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

export default function ComparePage() {
  const [colleges, setColleges] = useState<College[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("compareColleges");

    if (stored) {
      try {
        const data = JSON.parse(stored);

        if (Array.isArray(data)) {
          setColleges(data);
        }
      } catch (error) {
        console.error("Invalid compare data:", error);
        localStorage.removeItem("compareColleges");
      }
    }
  }, []);

  function removeCollege(id: number) {
    const updated = colleges.filter(
      (college) => college.id !== id
    );

    setColleges(updated);

    localStorage.setItem(
      "compareColleges",
      JSON.stringify(updated)
    );
  }

  function clearAll() {
    setColleges([]);
    localStorage.removeItem("compareColleges");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* NAVBAR */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
              C
            </div>

            <span className="text-xl font-bold">
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
              className="font-semibold text-blue-600"
            >
              Compare
            </Link>

            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* HEADER */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="text-sm font-medium text-blue-100 hover:text-white"
          >
            &larr; Back to Colleges
          </Link>

          <h1 className="mt-6 text-4xl font-bold">
            Compare Colleges
          </h1>

          <p className="mt-3 max-w-2xl text-blue-100">
            Compare colleges side by side and choose the best
            option for your career.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          {colleges.length === 0 ? (
            /* EMPTY STATE */
            <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-4xl">
                C
              </div>

              <h2 className="mt-6 text-2xl font-bold">
                No Colleges to Compare
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-slate-500">
                Add colleges from the college list or college
                details page to compare them here.
              </p>

              <Link
                href="/#colleges"
                className="mt-7 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Explore Colleges
              </Link>
            </div>
          ) : (
            <>
              {/* TOP ACTIONS */}
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-bold">
                    College Comparison
                  </h2>

                  <p className="mt-1 text-slate-500">
                    {colleges.length}{" "}
                    {colleges.length === 1
                      ? "college"
                      : "colleges"}{" "}
                    selected
                  </p>
                </div>

                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded-xl border border-red-200 bg-white px-5 py-2.5 font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Clear All
                </button>
              </div>

              {/* COMPARISON TABLE */}
              <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
                <table className="w-full min-w-[850px] border-collapse">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="sticky left-0 z-10 w-48 bg-slate-50 p-5 text-left font-semibold text-slate-600">
                        Details
                      </th>

                      {colleges.map((college) => (
                        <th
                          key={college.id}
                          className="min-w-[230px] p-5 text-left align-top"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold text-white">
                                {college.name.charAt(0)}
                              </div>

                              <h3 className="text-lg font-bold text-slate-900">
                                {college.name}
                              </h3>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeCollege(college.id)
                              }
                              className="rounded-lg px-2 py-1 text-xl text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                              title="Remove college"
                            >
                              &times;
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {/* LOCATION */}
                    <tr className="border-b">
                      <td className="sticky left-0 bg-white p-5 font-semibold text-slate-600">
                        Location
                      </td>

                      {colleges.map((college) => (
                        <td
                          key={college.id}
                          className="p-5 text-slate-700"
                        >
                          {college.location}
                        </td>
                      ))}
                    </tr>

                    {/* TYPE */}
                    <tr className="border-b bg-slate-50/50">
                      <td className="sticky left-0 bg-slate-50 p-5 font-semibold text-slate-600">
                        College Type
                      </td>

                      {colleges.map((college) => (
                        <td
                          key={college.id}
                          className="p-5 text-slate-700"
                        >
                          {college.type}
                        </td>
                      ))}
                    </tr>

                    {/* COURSE */}
                    <tr className="border-b">
                      <td className="sticky left-0 bg-white p-5 font-semibold text-slate-600">
                        Course
                      </td>

                      {colleges.map((college) => (
                        <td
                          key={college.id}
                          className="p-5 font-medium text-slate-800"
                        >
                          {college.course}
                        </td>
                      ))}
                    </tr>

                    {/* FEES */}
                    <tr className="border-b bg-slate-50/50">
                      <td className="sticky left-0 bg-slate-50 p-5 font-semibold text-slate-600">
                        Annual Fees
                      </td>

                      {colleges.map((college) => (
                        <td
                          key={college.id}
                          className="p-5 font-semibold text-slate-800"
                        >
                          {college.fees}
                        </td>
                      ))}
                    </tr>

                    {/* RATING */}
                    <tr className="border-b">
                      <td className="sticky left-0 bg-white p-5 font-semibold text-slate-600">
                        Rating
                      </td>

                      {colleges.map((college) => (
                        <td
                          key={college.id}
                          className="p-5"
                        >
                          <span className="inline-flex items-center gap-1 rounded-lg bg-yellow-100 px-3 py-2 font-bold text-yellow-700">
                            {college.rating}
                            <span>&#9733;</span>
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* PLACEMENT */}
                    <tr className="border-b bg-slate-50/50">
                      <td className="sticky left-0 bg-slate-50 p-5 font-semibold text-slate-600">
                        Placement
                      </td>

                      {colleges.map((college) => (
                        <td
                          key={college.id}
                          className="p-5 font-bold text-green-600"
                        >
                          {college.placement}
                        </td>
                      ))}
                    </tr>

                    {/* ACTION */}
                    <tr>
                      <td className="sticky left-0 bg-white p-5 font-semibold text-slate-600">
                        Action
                      </td>

                      {colleges.map((college) => (
                        <td
                          key={college.id}
                          className="p-5"
                        >
                          <Link
                            href={`/college/${college.id}`}
                            className="inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                          >
                            View College
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* LIMIT MESSAGE */}
              {colleges.length < 4 && (
                <div className="mt-6 rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
                  You can compare up to 4 colleges. Add more
                  colleges from the college listing.
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-white px-6 py-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="font-semibold">
            Copyright 2026 College Compass
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Find. Compare. Choose.
          </p>
        </div>
      </footer>
    </main>
  );
}