"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

const COMPARE_KEY = "compareColleges";
const SAVED_KEY = "savedColleges";

export default function Home() {
  const [search, setSearch] = useState("");
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [typeFilter, setTypeFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
const collegesPerPage = 6;

  // Compare + Save
  const [compareColleges, setCompareColleges] = useState<College[]>([]);
  const [savedColleges, setSavedColleges] = useState<College[]>([]);

  const [user, setUser] = useState<{
  id: number;
  name: string;
  email: string;
} | null>(null);

const [logoutLoading, setLogoutLoading] = useState(false);

  // =====================================================
  // LOAD COMPARE + SAVED DATA
  // =====================================================

  useEffect(() => {
    try {
      const storedCompare = localStorage.getItem(COMPARE_KEY);
      const storedSaved = localStorage.getItem(SAVED_KEY);

      if (storedCompare) {
        const parsedCompare = JSON.parse(storedCompare);

        if (Array.isArray(parsedCompare)) {
          setCompareColleges(parsedCompare);
        }
      }

      if (storedSaved) {
        const parsedSaved = JSON.parse(storedSaved);

        if (Array.isArray(parsedSaved)) {
          setSavedColleges(parsedSaved);
        }
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  }, []);

  // =====================================================
  // FETCH COLLEGES
  // =====================================================

  useEffect(() => {
    async function fetchColleges() {
      try {
        setLoading(true);
        setError("");

       const response = await fetch("/api/colleges");
if (response.status === 401) {
  setError("Please login to view colleges.");
  setColleges([]);
  return;
}

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
      // =====================================================
  // LOAD LOGGED-IN USER
  // =====================================================

  useEffect(() => {
    try {
      const storedUser = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user="))
        ?.split("=")[1];

      if (storedUser) {
        const parsedUser = JSON.parse(
          decodeURIComponent(storedUser)
        );

        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  }, []);
  // =====================================================
  // FILTER OPTIONS
  // =====================================================

  const types = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(colleges.map((college) => college.type))
      ),
    ];
  }, [colleges]);

  const courses = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(colleges.map((college) => college.course))
      ),
    ];
  }, [colleges]);

  // =====================================================
  // SEARCH + FILTER + SORT
  // =====================================================
const filteredColleges = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    const result = colleges.filter((college) => {
      const matchesSearch =
        !searchText ||
        college.name.toLowerCase().includes(searchText) ||
        college.location.toLowerCase().includes(searchText) ||
        college.course.toLowerCase().includes(searchText) ||
        college.type.toLowerCase().includes(searchText) ||
        college.fees.toLowerCase().includes(searchText) ||
        college.placement.toLowerCase().includes(searchText);

      const matchesType =
        typeFilter === "All" ||
        college.type === typeFilter;

      const matchesCourse =
        courseFilter === "All" ||
        college.course === courseFilter;

      const matchesRating =
        ratingFilter === "All" ||
        (ratingFilter === "4+" && college.rating >= 4) ||
        (ratingFilter === "4.5+" && college.rating >= 4.5);

      return (
        matchesSearch &&
        matchesType &&
        matchesCourse &&
        matchesRating
      );
    });

    if (sortBy === "rating-high") {
      result.sort((a, b) => b.rating - a.rating);
    }

    if (sortBy === "rating-low") {
      result.sort((a, b) => a.rating - b.rating);
    }

    if (sortBy === "name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (sortBy === "fees-low") {
      result.sort(
        (a, b) =>
          extractNumber(a.fees) -
          extractNumber(b.fees)
      );
    }

    if (sortBy === "fees-high") {
      result.sort(
        (a, b) =>
          extractNumber(b.fees) -
          extractNumber(a.fees)
      );
    }

    return result;
    
  }, [
    colleges,
    search,
    typeFilter,
    courseFilter,
    ratingFilter,
    sortBy,
  ]);
   const totalPages = Math.ceil(
    filteredColleges.length / collegesPerPage
  );

  const paginatedColleges = useMemo(() => {
    const startIndex =
      (currentPage - 1) * collegesPerPage;

    return filteredColleges.slice(
      startIndex,
      startIndex + collegesPerPage
    );
  }, [filteredColleges, currentPage]);
  // =====================================================
  // RESET FILTERS
  // =====================================================
useEffect(() => {
  setCurrentPage(1);
}, [search, typeFilter, courseFilter, ratingFilter, sortBy]);

  function resetFilters() {
    setSearch("");
    setTypeFilter("All");
    setCourseFilter("All");
    setRatingFilter("All");
    setSortBy("default");
    setCurrentPage(1);
  }
  // =====================================================
// LOGOUT
// =====================================================

async function handleLogout() {
  try {
    setLogoutLoading(true);

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
    alert("Unable to logout");
  } finally {
    setLogoutLoading(false);
  }
}

  // =====================================================
  // ADD TO COMPARE
  // =====================================================

  function addToCompare(college: College) {
    const alreadyAdded = compareColleges.some(
      (item) => item.id === college.id
    );

    if (alreadyAdded) {
      return;
    }

    if (compareColleges.length >= 4) {
      return;
    }

    const updated = [...compareColleges, college];

    setCompareColleges(updated);

    localStorage.setItem(
      COMPARE_KEY,
      JSON.stringify(updated)
    );
  }

  // =====================================================
  // REMOVE FROM COMPARE
  // =====================================================

  function removeFromCompare(id: number) {
    const updated = compareColleges.filter(
      (college) => college.id !== id
    );

    setCompareColleges(updated);

    localStorage.setItem(
      COMPARE_KEY,
      JSON.stringify(updated)
    );
  }

  // =====================================================
  // SAVE / UNSAVE COLLEGE
  // =====================================================

  function toggleSaveCollege(college: College) {
    const alreadySaved = savedColleges.some(
      (item) => item.id === college.id
    );

    let updated: College[];

    if (alreadySaved) {
      updated = savedColleges.filter(
        (item) => item.id !== college.id
      );
    } else {
      updated = [...savedColleges, college];
    }

    setSavedColleges(updated);

    localStorage.setItem(
      SAVED_KEY,
      JSON.stringify(updated)
    );
  }

  // =====================================================
  // CHECK STATUS
  // =====================================================

  function isCompared(id: number) {
    return compareColleges.some(
      (college) => college.id === id
    );
  }

  function isSaved(id: number) {
    return savedColleges.some(
      (college) => college.id === id
    );
  }

  // =====================================================
  // SCROLL
  // =====================================================

  function scrollToColleges() {
    document
      .getElementById("colleges")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">

          <Link
            href="/"
            className="flex items-center gap-3"
          >
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
              className="font-medium text-slate-600 transition hover:text-blue-600"
            >
              Colleges
            </Link>

            <Link
              href="/compare"
              className="font-medium text-slate-600 transition hover:text-blue-600"
            >
              ⚖️ Compare
              {compareColleges.length > 0 && (
                <span className="ml-1 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                  {compareColleges.length}
                </span>
              )}
            </Link>

            <Link
              href="#about"
              className="font-medium text-slate-600 transition hover:text-blue-600"
            >
              About
            </Link>

          </div>

 {user ? (
  <div className="flex items-center gap-3">
    <div className="text-right">
      <p className="text-sm font-semibold text-slate-900">
        Hi, {user.name}
      </p>

      <p className="text-xs text-slate-500">
        {user.email}
      </p>
    </div>

    <button
      onClick={handleLogout}
      disabled={logoutLoading}
      className="rounded-lg bg-red-500 px-4 py-2.5 font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {logoutLoading ? "Logging out..." : "Logout"}
    </button>
  </div>
) : (
  <Link
    href="/login"
    className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
  >
    Login
  </Link>
)}

        </div>
      </nav>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 px-4 py-16 text-white sm:px-6 sm:py-20">

        <div className="mx-auto max-w-5xl text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-100">
            Find Your Future
          </p>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Find the Right College
            <br />
            for Your Career
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-blue-100 sm:text-lg">
            Explore colleges, compare courses, fees, ratings
            and placement information to find the best option
            for your future.
          </p>

          {/* SEARCH */}

          <div className="mx-auto mt-10 flex max-w-2xl overflow-hidden rounded-2xl bg-white p-2 shadow-xl">

            <input
              type="text"
              placeholder="Search college, location, course, fees..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  scrollToColleges();
                }
              }}
              className="min-w-0 flex-1 px-4 py-3 text-slate-900 outline-none"
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

      {/* =================================================
          STATS
      ================================================= */}

      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-10 sm:px-6 md:grid-cols-4">

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
            {savedColleges.length}
          </h2>
          <p className="mt-2 text-slate-500">
            Saved Colleges
          </p>
        </div>

      </section>

      {/* =================================================
          COLLEGES
      ================================================= */}

      <section
        id="colleges"
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6"
      >

        <div className="mb-8">

          <h2 className="text-3xl font-bold">
            Popular Colleges
          </h2>

          <p className="mt-2 text-slate-500">
            Explore, filter and compare colleges from our database.
          </p>

        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm">

          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">

            <div>
              <h3 className="text-lg font-bold">
                Find Your College
              </h3>

              <p className="text-sm text-slate-500">
                Use filters to find the best match.
              </p>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Reset Filters
            </button>

          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            {/* TYPE */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                College Type
              </label>

              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                {types.map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* COURSE */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Course
              </label>

              <select
                value={courseFilter}
                onChange={(event) =>
                  setCourseFilter(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                {courses.map((course) => (
                  <option
                    key={course}
                    value={course}
                  >
                    {course}
                  </option>
                ))}
              </select>
            </div>

            {/* RATING */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Minimum Rating
              </label>

              <select
                value={ratingFilter}
                onChange={(event) =>
                  setRatingFilter(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="All">
                  All Ratings
                </option>

                <option value="4+">
                  4+ Rating
                </option>

                <option value="4.5+">
                  4.5+ Rating
                </option>
              </select>
            </div>

            {/* SORT */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Sort By
              </label>

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="default">
                  Default
                </option>

                <option value="rating-high">
                  Rating: High to Low
                </option>

                <option value="rating-low">
                  Rating: Low to High
                </option>

                <option value="name">
                  Name: A to Z
                </option>

                <option value="fees-low">
                  Fees: Low to High
                </option>

                <option value="fees-high">
                  Fees: High to Low
                </option>
              </select>
            </div>

          </div>

        </div>

        {/* =================================================
            RESULT COUNT
        ================================================= */}

        {!loading && !error && (
          <div className="mb-5">

            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-900">
                {filteredColleges.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-900">
                {colleges.length}
              </span>{" "}
              colleges
            </p>

          </div>
        )}

        {/* =================================================
            COMPARE BAR
        ================================================= */}

        {compareColleges.length > 0 && (
          <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <h3 className="font-bold text-blue-900">
                  ⚖️ Compare Colleges
                </h3>

                <p className="mt-1 text-sm text-blue-700">
                  {compareColleges.length} of 4 colleges selected
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">

                {compareColleges.map((college) => (
                  <button
                    key={college.id}
                    type="button"
                    onClick={() =>
                      removeFromCompare(college.id)
                    }
                    className="rounded-full bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-red-50 hover:text-red-600"
                  >
                    {college.name} ×
                  </button>
                ))}

                <Link
                  href="/compare"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Compare Now →
                </Link>

              </div>

            </div>

          </div>
        )}

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

            <p className="mt-5 text-lg font-medium">
              Loading colleges...
            </p>

          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

       {!loading && error && (
  <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
      🔒
    </div>

    <h3 className="mt-5 text-2xl font-bold text-slate-900">
      Login Required
    </h3>

    <p className="mx-auto mt-2 max-w-md text-slate-500">
      Please login to your College Compass account to explore colleges,
      compare them, and save your favorites.
    </p>

    <Link
      href="/login"
      className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
    >
      Login to Continue
    </Link>

    <p className="mt-4 text-sm text-slate-500">
      Don't have an account?{" "}
      <Link
        href="/register"
        className="font-semibold text-blue-600 hover:text-blue-700"
      >
        Create Account
      </Link>
    </p>

  </div>
)}
        {/* =================================================
            NO RESULTS
        ================================================= */}

        {!loading &&
          !error &&
          filteredColleges.length === 0 && (

            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

              <div className="text-4xl">
                🔍
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                No colleges found
              </h3>

              <p className="mt-2 text-slate-500">
                Try changing your search or filters.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Clear Filters
              </button>

            </div>
          )}

        {/* =================================================
            COLLEGE CARDS
        ================================================= */}

        {!loading &&
          !error &&
          filteredColleges.length > 0 && (

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {filteredColleges.map((college) => {

                const compared = isCompared(college.id);
                const saved = isSaved(college.id);

                return (
                  <article
                    key={college.id}
                    className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >

                    {/* CARD HEADER */}

                    <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">

                      <span className="text-6xl font-bold text-white">
                        {college.name.charAt(0)}
                      </span>

                      {/* HEART */}

                      <button
                        type="button"
                        onClick={() =>
                          toggleSaveCollege(college)
                        }
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl shadow-md transition hover:scale-110"
                        aria-label="Save college"
                      >
                        {saved ? "❤️" : "♡"}
                      </button>

                    </div>

                    {/* CARD BODY */}

                    <div className="p-6">

                      <div className="flex items-start justify-between gap-3">

                        <h3 className="text-xl font-bold">
                          {college.name}
                        </h3>

                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-sm font-semibold text-yellow-700">
                          ⭐ {college.rating}
                        </span>

                      </div>

                      <p className="mt-3 text-slate-500">
                        📍 {college.location}
                      </p>

                      <p className="mt-2 text-slate-600">
                        🎓 Course: {college.course}
                      </p>

                      <p className="mt-2 text-slate-600">
                        🏫 Type: {college.type}
                      </p>

                      <p className="mt-2 font-semibold text-slate-800">
                        💰 Fees: {college.fees}
                      </p>

                      <p className="mt-2 text-sm font-medium text-green-600">
                        📈 Placement: {college.placement}
                      </p>

                      {/* VIEW */}

                      <Link
                        href={`/college/${college.id}`}
                        className="mt-6 block w-full rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
                      >
                        View College
                      </Link>

                      {/* COMPARE */}

                      <button
                        type="button"
                        onClick={() =>
                          addToCompare(college)
                        }
                        disabled={
                          compared ||
                          compareColleges.length >= 4
                        }
                        className={`mt-3 w-full rounded-xl border px-4 py-3 font-semibold transition ${
                          compared
                            ? "cursor-default border-green-200 bg-green-50 text-green-600"
                            : compareColleges.length >= 4
                              ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                              : "border-blue-200 text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        {compared
                          ? "✓ Added to Compare"
                          : compareColleges.length >= 4
                            ? "Compare Limit Reached"
                            : "⚖️ Add to Compare"}
                      </button>

                      {/* SAVE */}

                      <button
                        type="button"
                        onClick={() =>
                          toggleSaveCollege(college)
                        }
                        className={`mt-3 w-full rounded-xl border px-4 py-3 font-semibold transition ${
                          saved
                            ? "border-red-200 bg-red-50 text-red-600"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {saved
                          ? "❤️ Saved College"
                          : "♡ Save College"}
                      </button>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

      </section>

      {/* =================================================
          ABOUT
      ================================================= */}

      <section
        id="about"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6"
      >

        <div className="rounded-3xl bg-slate-900 px-6 py-14 text-center text-white sm:px-8">

          <h2 className="text-3xl font-bold md:text-4xl">
            Make the Right College Choice
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            College Compass helps students discover and
            compare colleges, courses and opportunities
            in one place.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <button
              type="button"
              onClick={scrollToColleges}
              className="rounded-xl bg-blue-600 px-7 py-3 font-semibold hover:bg-blue-700"
            >
              Explore Colleges
            </button>

            <Link
              href="/compare"
              className="rounded-xl border border-slate-600 px-7 py-3 font-semibold hover:bg-slate-800"
            >
              Compare Colleges
            </Link>

          </div>

        </div>

      </section>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="border-t bg-white px-4 py-8 sm:px-6">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">

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

// =====================================================
// HELPER: EXTRACT NUMBER FROM FEES
// =====================================================

function extractNumber(value: string): number {
  const cleaned = value
    .replace(/,/g, "")
    .replace(/[₹$]/g, "")
    .trim();

  const match = cleaned.match(
    /[\d]+(?:\.\d+)?/
  );

  if (!match) {
    return Number.MAX_SAFE_INTEGER;
  }

  let number = Number(match[0]);

  const lowerValue = value.toLowerCase();

  if (lowerValue.includes("lakh")) {
    number *= 100000;
  }

  if (lowerValue.includes("lac")) {
    number *= 100000;
  }

  if (lowerValue.includes("crore")) {
    number *= 10000000;
  }

  if (lowerValue.includes("cr")) {
    number *= 10000000;
  }

  if (lowerValue.includes("k")) {
    number *= 1000;
  }

  return number;
}