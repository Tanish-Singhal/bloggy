import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";

const credentialSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 6 characters long"),
  username: z.string().min(4, "Username must be at least 4 characters long"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = credentialSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByEmail = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        {
          user: null,
          message: "User already exists",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByUsername = await prisma.user.findFirst({
      where: {
        email: body.username,
      },
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        {
          user: null,
          message: "username already exists",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        username: body.username,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        user: newUser,
        message: "User created successfully",
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    return NextResponse.json(
      {
        user: null,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
