import { NextResponse } from "next/server";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";
import { db } from "@/lib/prisma";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");

  const derivedKey = (await scryptAsync(
    password,
    salt,
    64
  )) as Buffer;

  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          message: "Name, email and password are required",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          message: "Password must be at least 6 characters",
        },
        { status: 400 }
      );
    }

    // Check existing user
    const existingUser =
      await db.orm.public.User.where({
        email,
      }).first();

    if (existingUser) {
      return NextResponse.json(
        {
          message:
            "An account with this email already exists",
        },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash =
      await hashPassword(password);

    // Create user
    const user =
      await db.orm.public.User.create({
        name,
        email,
        passwordHash,
      });

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Something went wrong while creating account",
      },
      { status: 500 }
    );
  }
}