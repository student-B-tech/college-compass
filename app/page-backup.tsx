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

export default function Home() {
  const [search, setSearch] = useState("");
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchColleges() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/colleges");

        if (!response.ok) {
          throw new Error("Failed to fetch colleges");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid college data");
        }

        setColleges(data);
      } catch (error) {
        console.error("Error fetching colleges:", error);
        setError("Unable to load colleges.");
      } finally {
        setLoading(false);
      }
    }

    fetchColleges();
  }, []);

  const searchText = search.toLowerCase().trim();

  const filteredColleges = colleges.filter((college) => {
    if (!searchText) {
      return true;
    }

    return (
      college.name.toLowerCase().includes(searchText) ||
      college.location.toLowerCase().includes(searchText) ||
      college.course.toLowerCase().includes(searchText) ||
      college.type.toLowerCase().includes(searchText)
    );
  });

  function scrollToColleges() {
    document
      .getElementById("colleges")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
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

          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="font-semibold text-blue-600"
            >
              Home
            </Link>

            <Link
              href="#colleges"
              className="font-medium text-slate-600 hover:text-blue-600"
            >
              Colleges
            </Link>

            <Link
              href="#about"
              className="font-medium text-slate-600 hover:text-blue-600"
            >
              About
            </Link>
          </div>

          <button
            type="button"
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-100">
            Find Your Future
          </p>

          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Find the Right College
            <br />
            for Your Career
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
            Explore colleges, compare courses, fees, ratings and
            placement information to find the best option for your
            future.
          </p>

          {/* Search */}
          <div className="mx-auto mt-10 flex max-w-2xl overflow-hidden rounded-2xl bg-white p-2 shadow-xl">
            <input
              type="text"
              placeholder="Search college, location or course..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  scrollToColleges();
                }
              }}
              className="flex-1 px-4 py-3 text-slate-900 outline-none"
            />

            <button
              type="button"
              onClick={scrollToColleges}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 py-10 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <h2 className="text-3xl font-bold text-blue-600">
            {colleges.length}+
          </h2>

          <p className="mt-2 text-slate-500">
            Colleges
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <h2 className="text-3xl font-bold text-blue-600">
            1000+
          </h2>

          <p className="mt-2 text-slate-500">
            Courses
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <h2 className="text-3xl font-bold text-blue-600">
            50+
          </h2>

          <p className="mt-2 text-slate-500">
            Cities
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <h2 className="text-3xl font-bold text-blue-600">
            10K+
          </h2>

          <p className="mt-2 text-slate-500">
            Students
          </p>
        </div>
      </section>

      {/* Colleges */}
      <section
        id="colleges"
        className="mx-auto max-w-7xl px-6 py-10"
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Popular Colleges
          </h2>

          <p className="mt-2 text-slate-500">
            Explore colleges directly from our database.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

            <p className="mt-5 text-lg font-medium">
              Loading colleges...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl bg-red-50 p-10 text-center">
            <h3 className="text-xl font-semibold text-red-600">
              {error}
            </h3>

            <p className="mt-2 text-red-500">
              Please make sure the server and database are running.
            </p>
          </div>
        )}

        {/* No results */}
        {!loading &&
          !error &&
          filteredColleges.length === 0 && (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <h3 className="text-xl font-semibold">
                No colleges found
              </h3>

              <p className="mt-2 text-slate-500">
                Try searching for another college, location or
                course.
              </p>
            </div>
          )}

        {/* College Cards */}
        {!loading &&
          !error &&
          filteredColleges.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredColleges.map((college) => (
                <article
                  key={college.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* College Header */}
                  <div className="flex h-40 items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                    <span className="text-6xl font-bold text-white">
                      {college.name.charAt(0)}
                    </span>
                  </div>

                  {/* College Information */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold">
                        {college.name}
                      </h3>

                      <span className="shrink-0 rounded-full bg-yellow-100 px-2.5 py-1 text-sm font-semibold text-yellow-700">
                        {college.rating}
                      </span>
                    </div>

                    <p className="mt-3 text-slate-500">
                      Location: {college.location}
                    </p>

                    <p className="mt-2 text-slate-600">
                      Course: {college.course}
                    </p>

                    <p className="mt-2 text-slate-600">
                      Type: {college.type}
                    </p>

                    <p className="mt-2 font-semibold text-slate-800">
                      Fees: {college.fees}
                    </p>

                    <p className="mt-2 text-sm text-green-600">
                      Placement: {college.placement}
                    </p>

                    {/* View College */}
                    <Link
                      href={`/college/${college.id}`}
                      className="mt-6 block w-full rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
                    >
                      View College
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
      </section>

      {/* About / CTA */}
      <section
        id="about"
        className="mx-auto max-w-7xl px-6 py-16"
      >
        <div className="rounded-3xl bg-slate-900 px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-bold md:text-4xl">
            Make the Right College Choice
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            College Compass helps students discover and compare
            colleges, courses and opportunities in one place.
          </p>

          <button
            type="button"
            onClick={scrollToColleges}
            className="mt-8 rounded-xl bg-blue-600 px-7 py-3 font-semibold transition hover:bg-blue-700"
          >
            Explore Colleges
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <p className="font-semibold">
            Copyright 2026 College Compass
          </p>

          <p className="text-sm text-slate-500">
            Full Stack College Discovery Platform
          </p>
        </div>
      </footer>
    </main>
  );
}