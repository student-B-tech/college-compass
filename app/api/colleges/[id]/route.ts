import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

// GET - Get a single college
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collegeId = Number(id);

    if (!Number.isInteger(collegeId) || collegeId <= 0) {
      return NextResponse.json(
        { error: "Invalid college ID" },
        { status: 400 }
      );
    }

    const college = await db.orm.public.College.first({
      id: collegeId,
    });

    if (!college) {
      return NextResponse.json(
        { error: "College not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(college);
  } catch (error) {
    console.error("Database GET error:", error);

    return NextResponse.json(
      { error: "Failed to fetch college" },
      { status: 500 }
    );
  }
}

// PUT - Update a college
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collegeId = Number(id);

    if (!Number.isInteger(collegeId) || collegeId <= 0) {
      return NextResponse.json(
        { error: "Invalid college ID" },
        { status: 400 }
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

    const college = await db.orm.public.College
      .where({ id: collegeId })
      .update({
        name: String(name).trim(),
        location: String(location).trim(),
        type: String(type).trim(),
        course: String(course).trim(),
        fees: String(fees).trim(),
        rating: numericRating,
        placement: String(placement).trim(),
      });

    if (!college) {
      return NextResponse.json(
        { error: "College not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(college);
  } catch (error) {
    console.error("Database PUT error:", error);

    return NextResponse.json(
      { error: "Failed to update college" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a college
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collegeId = Number(id);

    if (!Number.isInteger(collegeId) || collegeId <= 0) {
      return NextResponse.json(
        { error: "Invalid college ID" },
        { status: 400 }
      );
    }

    const college = await db.orm.public.College
      .where({ id: collegeId })
      .delete();

    if (!college) {
      return NextResponse.json(
        { error: "College not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "College deleted successfully",
      college,
    });
  } catch (error) {
    console.error("Database DELETE error:", error);

    return NextResponse.json(
      { error: "Failed to delete college" },
      { status: 500 }
    );
  }
}