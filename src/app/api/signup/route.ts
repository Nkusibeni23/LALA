import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const errorMessage = validateUserInput(body);
    if (errorMessage) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { name, email, password, role = "RENTER" } = body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully.", user: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: "Error creating user." },
      { status: 500 }
    );
  }
}

function validateUserInput(data: any) {
  if (!data.email || !data.password || !data.name) {
    return "All fields are required.";
  }
  if (data.password.length < 6) {
    return "Password must be at least 6 characters.";
  }
  if (!["RENTER", "HOST"].includes(data.role)) {
    return "Invalid role. Choose either 'RENTER' or 'HOST'.";
  }
  return null;
}
