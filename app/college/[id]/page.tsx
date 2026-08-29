"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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

export default function CollegeDetails() {
  const params = useParams();

  const id = params.id as string;

  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    async function fetchCollege() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/colleges/${id}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "College not found");
        }

        setCollege(data);
      } catch (error) {
        console.error("Error fetching college:", error);
        setError("College not found");
      } finally {
        setLoading(false);
      }
    }

    fetchCollege();
  }, [id]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Loading college...
          </h1>

          <p className="mt-2 text-slate-500">
            Please wait while we fetch the college information.
          </p>
        </div>
      </main>
    );
  }

  /* ================= ERROR ================= */

  if (error || !college) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl font-bold text-red-600">
            !
          </div>

          <h1 className="mt-6 text-4xl font-bold text-slate-900">
            College Not Found
          </h1>

          <p className="mt-3 text-slate-500">
            The college you are looking for does not exist.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Colleges
          </Link>
        </div>
      </main>
    );
  }

  /* ================= COLLEGE DETAILS ================= */

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================= NAVBAR ================= */}

      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
              C
            </div>

            <span className="text-lg font-bold sm:text-xl">
              College Compass
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-6">

            <Link
              href="/"
              className="hidden font-medium text-slate-600 hover:text-blue-600 sm:block"
            >
              Home
            </Link>

            <Link
              href="/#colleges"
              className="font-semibold text-blue-600"
            >
              Colleges
            </Link>

          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}

      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 px-4 py-12 text-white sm:px-6 sm:py-16">

        <div className="mx-auto max-w-7xl">

          <Link
            href="/#colleges"
            className="text-sm font-medium text-blue-100 transition hover:text-white"
          >
            Back to Colleges
          </Link>

          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center">

            {/* COLLEGE LOGO */}

            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-white/20 text-5xl font-bold backdrop-blur sm:h-28 sm:w-28 sm:text-6xl">
              {college.name.charAt(0).toUpperCase()}
            </div>

            {/* COLLEGE NAME */}

            <div>

              <div className="mb-3 flex flex-wrap gap-2">

                <span className="rounded-full bg-white/20 px-3 py-1 text-sm">
                  {college.type}
                </span>

                <span className="rounded-full bg-white/20 px-3 py-1 text-sm">
                  {college.course}
                </span>

              </div>

              <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
                {college.name}
              </h1>

              <p className="mt-3 text-base text-blue-100 sm:text-lg">
                Location: {college.location}
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">

        <div className="grid gap-8 lg:grid-cols-3">

          {/* ================= LEFT ================= */}

          <div className="space-y-8 lg:col-span-2">

            {/* ABOUT */}

            <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-7">

              <h2 className="text-2xl font-bold">
                About {college.name}
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                {college.name} is a {college.type.toLowerCase()} college
                located in {college.location}. The college offers{" "}
                {college.course} programs for students looking to build
                their career.
              </p>

            </div>

            {/* COURSE */}

            <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-7">

              <h2 className="text-2xl font-bold">
                Courses and Programs
              </h2>

              <div className="mt-5 rounded-xl border border-slate-200 p-5">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <h3 className="text-lg font-bold">
                      {college.course}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Undergraduate Program
                    </p>

                  </div>

                  <span className="w-fit rounded-lg bg-blue-50 px-3 py-2 font-semibold text-blue-600">
                    {college.course}
                  </span>

                </div>

              </div>
            </div>

            {/* ADMISSION */}

            <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-7">

              <h2 className="text-2xl font-bold">
                Admission
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-slate-50 p-5">

                  <p className="text-sm text-slate-500">
                    Course
                  </p>

                  <p className="mt-2 font-bold">
                    {college.course}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-5">

                  <p className="text-sm text-slate-500">
                    College Type
                  </p>

                  <p className="mt-2 font-bold">
                    {college.type}
                  </p>

                </div>

              </div>
            </div>

            {/* PLACEMENT */}

            <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-7">

              <h2 className="text-2xl font-bold">
                Placement
              </h2>

              <div className="mt-5 rounded-xl bg-green-50 p-5">

                <p className="text-sm text-slate-500">
                  Average Placement
                </p>

                <p className="mt-2 text-2xl font-bold text-green-600">
                  {college.placement}
                </p>

              </div>

            </div>

          </div>

          {/* ================= RIGHT SIDEBAR ================= */}

          <aside className="space-y-6">

            {/* RATING */}

            <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-7">

              <p className="text-sm font-medium text-slate-500">
                College Rating
              </p>

              <div className="mt-3 flex items-center gap-3">

                <span className="text-4xl font-bold">
                  {college.rating}
                </span>

                <span className="text-2xl text-yellow-500">
                  ★
                </span>

              </div>

              <p className="mt-2 text-sm text-slate-500">
                Overall college rating
              </p>

            </div>

            {/* INFORMATION */}

            <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-7">

              <h2 className="text-xl font-bold">
                College Information
              </h2>

              <div className="mt-5 space-y-5">

                <div>
                  <p className="text-sm text-slate-500">
                    Annual Fees
                  </p>

                  <p className="mt-1 font-bold">
                    {college.fees}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Average Placement
                  </p>

                  <p className="mt-1 font-bold text-green-600">
                    {college.placement}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Course
                  </p>

                  <p className="mt-1 font-bold">
                    {college.course}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    College Type
                  </p>

                  <p className="mt-1 font-bold">
                    {college.type}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Location
                  </p>

                  <p className="mt-1 font-bold">
                    {college.location}
                  </p>
                </div>

              </div>

            </div>

            {/* ACTIONS */}

            <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-7">

              <button
                type="button"
                onClick={() => {
                  alert(`${college.name} added to compare!`);
                }}
                className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Add to Compare
              </button>

              <button
                type="button"
                onClick={() => {
                  alert(`${college.name} saved!`);
                }}
                className="mt-3 w-full rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Save College
              </button>

            </div>

          </aside>

        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="border-t bg-white px-4 py-8 sm:px-6">

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