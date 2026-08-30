"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";


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

const emptyForm = {
  name: "",
  location: "",
  type: "",
  course: "",
  fees: "",
  rating: "",
  placement: "",
};

export default function AdminPage() {
    const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("collegeCompassUser");

    if (!storedUser) {
      router.replace("/login");
      return;
    }
  }, [router]);
  
  const [colleges, setColleges] = useState<College[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadColleges() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/colleges");

      if (!response.ok) {
        throw new Error("Failed to load colleges");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid college data");
      }

      setColleges(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load colleges.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadColleges();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function startEdit(college: College) {
    setEditingId(college.id);

    setForm({
      name: college.name,
      location: college.location,
      type: college.type,
      course: college.course,
      fees: college.fees,
      rating: String(college.rating),
      placement: college.placement,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
  }

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        name: form.name.trim(),
        location: form.location.trim(),
        type: form.type.trim(),
        course: form.course.trim(),
        fees: form.fees.trim(),
        rating: Number(form.rating),
        placement: form.placement.trim(),
      };

      if (
        !payload.name ||
        !payload.location ||
        !payload.type ||
        !payload.course ||
        !payload.fees ||
        !payload.placement
      ) {
        setError("Please fill all fields.");
        setSaving(false);
        return;
      }

      if (
        Number.isNaN(payload.rating) ||
        payload.rating < 0 ||
        payload.rating > 5
      ) {
        setError("Rating must be between 0 and 5.");
        setSaving(false);
        return;
      }

      let response: Response;

      if (editingId !== null) {
        response = await fetch(
          `/api/colleges/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        response = await fetch("/api/colleges", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong"
        );
      }

      setMessage(
        editingId !== null
          ? "College updated successfully."
          : "College added successfully."
      );

      setEditingId(null);
      setForm(emptyForm);

      await loadColleges();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteCollege(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this college?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `/api/colleges/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete college"
        );
      }

      setMessage("College deleted successfully.");

      if (editingId === id) {
        cancelEdit();
      }

      await loadColleges();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete college."
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* NAVBAR */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
              C
            </div>

            <span className="text-xl font-bold">
              College Compass
            </span>
          </a>

          <div className="flex items-center gap-4">
            <a
              href="/"
              className="font-medium text-slate-600 hover:text-blue-600"
            >
              Home
            </a>

            <a
              href="/compare"
              className="font-medium text-slate-600 hover:text-blue-600"
            >
              Compare
            </a>

            <a
              href="/saved"
              className="font-medium text-slate-600 hover:text-blue-600"
            >
              Saved
            </a>
          </div>
        </div>
      </nav>

      {/* HEADER */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-100">
            Administration
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Admin Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-blue-100">
            Add, update and delete colleges from the
            College Compass database.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          {/* FORM */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold">
                  {editingId !== null
                    ? "Edit College"
                    : "Add New College"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter complete college information.
                </p>
              </div>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-xl border px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {message && (
              <div className="mb-5 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="grid gap-5 md:grid-cols-2"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  College Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="College name"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Location
                </label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="City, State"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  College Type
                </label>

                <input
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  placeholder="Government / Private"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Course
                </label>

                <input
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  placeholder="B.Tech / MBA / BCA"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Annual Fees
                </label>

                <input
                  name="fees"
                  value={form.fees}
                  onChange={handleChange}
                  placeholder="₹1,00,000"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Rating
                </label>

                <input
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={handleChange}
                  placeholder="4.5"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold">
                  Placement
                </label>

                <input
                  name="placement"
                  value={form.placement}
                  onChange={handleChange}
                  placeholder="8 Lpa"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                      ? "Update College"
                      : "Add College"}
                </button>
              </div>
            </form>
          </div>

          {/* COLLEGE LIST */}
          <div className="mt-8">
            <div className="mb-5">
              <h2 className="text-2xl font-bold">
                All Colleges
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {colleges.length} colleges in database
              </p>
            </div>

            {loading ? (
              <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                Loading colleges...
              </div>
            ) : colleges.length === 0 ? (
              <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                <h3 className="text-xl font-bold">
                  No colleges found
                </h3>

                <p className="mt-2 text-slate-500">
                  Add your first college using the form above.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {colleges.map((college) => (
                  <article
                    key={college.id}
                    className="rounded-2xl bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                        {college.name.charAt(0)}
                      </div>

                      <span className="rounded-lg bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700">
                        {college.rating} / 5
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-bold">
                      {college.name}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      {college.location}
                    </p>

                    <div className="mt-4 space-y-2 text-sm">
                      <p>
                        <strong>Type:</strong>{" "}
                        {college.type}
                      </p>

                      <p>
                        <strong>Course:</strong>{" "}
                        {college.course}
                      </p>

                      <p>
                        <strong>Fees:</strong>{" "}
                        {college.fees}
                      </p>

                      <p className="font-semibold text-green-600">
                        Placement: {college.placement}
                      </p>
                    </div>

                    <div className="mt-5 flex gap-3">
                      <button
                        type="button"
                        onClick={() => startEdit(college)}
                        className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteCollege(college.id)
                        }
                        className="flex-1 rounded-xl border border-red-200 px-4 py-2.5 font-semibold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-white px-6 py-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="font-semibold">
            Copyright 2026 College Compass
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Admin Dashboard
          </p>
        </div>
      </footer>
    </main>
  );
}