import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/prisma";

// Check whether user is logged in
async function isAuthenticated() {
  const cookieStore = await cookies();

  const authToken = cookieStore.get("auth_token");

  return !!authToken?.value;
}

// GET - All colleges
export async function GET() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json(
        { error: "Please login to view colleges" },
        { status: 401 }
      );
    }

    const colleges = await db.orm.public.College
      .orderBy((college) => college.id.asc())
      .all();

    return NextResponse.json(colleges);
  } catch (error) {
    console.error("Database GET error:", error);

    return NextResponse.json(
      { error: "Failed to fetch colleges" },
      { status: 500 }
    );
  }
}

// POST - Add a new college
export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json(
        { error: "Please login first" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      name,
      location,
      type,
      course,
      fees,
      rating,
      placement,
    } = body;

    if (
      !name ||
      !location ||
      !type ||
      !course ||
      !fees ||
      rating === undefined ||
      !placement
    ) {
      return NextResponse.json(
        { error: "All college fields are required" },
        { status: 400 }
      );
    }

    const numericRating = Number(rating);

    if (
      Number.isNaN(numericRating) ||
      numericRating < 0 ||
      numericRating > 5
    ) {
      return NextResponse.json(
        { error: "Rating must be between 0 and 5" },
        { status: 400 }
      );
    }

    const college = await db.orm.public.College.create({
      name: String(name).trim(),
      location: String(location).trim(),
      type: String(type).trim(),
      course: String(course).trim(),
      fees: String(fees).trim(),
      rating: numericRating,
      placement: String(placement).trim(),
    });

    return NextResponse.json(college, { status: 201 });
  } catch (error) {
    console.error("Database POST error:", error);

    return NextResponse.json(
      { error: "Failed to create college" },
      { status: 500 }
    );
  }
}