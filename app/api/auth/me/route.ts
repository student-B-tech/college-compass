import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHmac } from "crypto";
import { db } from "@/lib/prisma";

function getSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured");
  }

  return secret;
}

function verifyToken(token: string) {
  try {
    const [userId, signature] = token.split(".");

    if (!userId || !signature) {
      return null;
    }

    const expectedSignature = createHmac(
      "sha256",
      getSecret()
    )
      .update(userId)
      .digest("hex");

    if (signature.length !== expectedSignature.length) {
      return null;
    }

    const valid = createHmac(
      "sha256",
      getSecret()
    )
      .update(userId)
      .digest("hex");

    if (valid !== signature) {
      return null;
    }

    const id = Number(userId);

    if (!Number.isInteger(id) || id <= 0) {
      return null;
    }

    return id;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    const userId = verifyToken(token);

    if (!userId) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    const user = await db.orm.public.User.first({
      id: userId,
    });

    if (!user) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("AUTH ME ERROR:", error);

    return NextResponse.json(
      {
        authenticated: false,
        message: "Unable to verify session",
      },
      { status: 500 }
    );
  }
}