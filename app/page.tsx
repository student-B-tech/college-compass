"use client";

import { useState } from "react";

const colleges = [
  {
    name: "IIT Delhi",
    location: "New Delhi, India",
    course: "B.Tech",
    fees: "₹2.2 Lakhs/year",
    rating: 4.8,
  },
  {
    name: "IIT Kanpur",
    location: "Kanpur, Uttar Pradesh",
    course: "B.Tech",
    fees: "₹2.1 Lakhs/year",
    rating: 4.7,
  },
  {
    name: "IIT Bombay",
    location: "Mumbai, Maharashtra",
    course: "B.Tech",
    fees: "₹2.3 Lakhs/year",
    rating: 4.9,
  },
];

export default function Home() {
  const [search, setSearch] = useState("");

  const filteredColleges = colleges.filter(
    (college) =>
      college.name.toLowerCase().includes(search.toLowerCase()) ||
      college.location.toLowerCase().includes(search.toLowerCase()) ||
      college.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
              C
            </div>

            <h1 className="text-xl font-bold">College Compass</h1>
          </div>

          <div className="hidden gap-6 md:flex">
            <a href="#" className="font-medium hover:text-blue-600">
              Home
            </a>
            <a href="#colleges" className="font-medium hover:text-blue-600">
              Colleges
            </a>
            <a href="#about" className="font-medium hover:text-blue-600">
              About
            </a>
          </div>

          <button className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700">
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-100">
            Find Your Future
          </p>

          <h2 className="text-4xl font-bold leading-tight md:text-6xl">
            Find the Right College
            <br />
            for Your Career
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
            Explore colleges, compare courses, fees, ratings and find the best
            option for your future.
          </p>

          {/* Search */}
          <div className="mx-auto mt-10 flex max-w-2xl overflow-hidden rounded-2xl bg-white p-2 shadow-xl">
            <input
              type="text"
              placeholder="Search college, location or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 text-slate-900 outline-none"
            />

            <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 py-10 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <h3 className="text-3xl font-bold text-blue-600">500+</h3>
          <p className="mt-2 text-slate-500">Colleges</p>
        </div>

        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <h3 className="text-3xl font-bold text-blue-600">1000+</h3>
          <p className="mt-2 text-slate-500">Courses</p>
        </div>

        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <h3 className="text-3xl font-bold text-blue-600">50+</h3>
          <p className="mt-2 text-slate-500">Cities</p>
        </div>

        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <h3 className="text-3xl font-bold text-blue-600">10K+</h3>
          <p className="mt-2 text-slate-500">Students</p>
        </div>
      </section>

      {/* Colleges */}
      <section id="colleges" className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Popular Colleges</h2>
          <p className="mt-2 text-slate-500">
            Explore some of the top colleges in India.
          </p>
        </div>

        {filteredColleges.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h3 className="text-xl font-semibold">No colleges found</h3>
            <p className="mt-2 text-slate-500">
              Try searching for another college or location.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {filteredColleges.map((college) => (
              <div
                key={college.name}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                  <span className="text-6xl font-bold text-white">
                    {college.name.charAt(0)}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold">{college.name}</h3>

                    <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-sm font-semibold text-yellow-700">
                      ★ {college.rating}
                    </span>
                  </div>

                  <p className="mt-3 text-slate-500">
                    📍 {college.location}
                  </p>

                  <p className="mt-2 text-slate-600">
                    🎓 {college.course}
                  </p>

                  <p className="mt-2 font-semibold text-slate-800">
                    💰 {college.fees}
                  </p>

                  <button className="mt-6 w-full rounded-xl border border-blue-600 px-4 py-3 font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white">
                    View College
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section
        id="about"
        className="mx-auto max-w-7xl px-6 py-16"
      >
        <div className="rounded-3xl bg-slate-900 px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-bold md:text-4xl">
            Make the Right College Choice
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            College Compass helps students discover and compare colleges,
            courses and opportunities in one place.
          </p>

          <button className="mt-8 rounded-xl bg-blue-600 px-7 py-3 font-semibold hover:bg-blue-700">
            Explore Colleges
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <p className="font-semibold">© 2026 College Compass</p>

          <p className="text-sm text-slate-500">
            Full Stack College Discovery Platform
          </p>
        </div>
      </footer>
    </main>
  );
}