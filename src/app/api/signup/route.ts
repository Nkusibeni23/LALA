import { NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password, role = "RENTER" } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

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
        email,
        name,
        password: hashedPassword,
        role,
      } as Prisma.UserUncheckedCreateInput,
    });

    return NextResponse.json({
      message: "User registered successfully.",
      user: newUser,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating user." },
      { status: 500 }
    );
  }
}
