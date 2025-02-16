import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      include: { host: true },
    });
    return NextResponse.json(properties);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "HOST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { title, description, price, location, images, amenities } =
      await req.json();
    if (!title || !price || !location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const property = await prisma.property.create({
      data: {
        title,
        description,
        price,
        location,
        images,
        amenities,
        hostId: session.user.id,
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
