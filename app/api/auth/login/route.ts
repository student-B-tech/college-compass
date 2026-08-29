import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { promisify } from "util";
import { scrypt, timingSafeEqual } from "crypto";
import { db } from "@/lib/prisma";

const scryptAsync = promisify(scrypt);

function createAuthToken(userId: number) {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured");
  }

  const userIdString = String(userId);

  const signature = createHmac("sha256", secret)
    .update(userIdString)
    .digest("hex");

  return `${userIdString}.${signature}`;
}

async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    const [salt, key] = storedHash.split(":");

    if (!salt || !key) {
      return false;
    }

    const derivedKey = (await scryptAsync(
      password,
      salt,
      64
    )) as Buffer;

    const storedKey = Buffer.from(key, "hex");

    if (derivedKey.length !== storedKey.length) {
      return false;
    }

    return timingSafeEqual(derivedKey, storedKey);
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    const user = await db.orm.public.User.first({
      email,
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    const passwordValid = await verifyPassword(
      password,
      user.passwordHash
    );

    if (!passwordValid) {
      return NextResponse.json(
        {
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    const token = createAuthToken(user.id);

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    response.cookies.set(
      "user",
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
      }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong while logging in",
      },
      { status: 500 }
    );
  }
}