import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "HOST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const {
      category,
      title,
      description,
      price,
      location,
      images,
      amenities,
      rooms,
      bathrooms,
    } = await req.json();

    if (!title || !price || !location || !rooms || !bathrooms) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const property = await prisma.property.create({
      data: {
        category,
        title,
        description,
        price: parseFloat(price),
        location,
        images,
        amenities,
        rooms: parseInt(rooms),
        bathrooms: parseInt(bathrooms),
        hostId: session.user.id,
      } as any,
    });

    return NextResponse.json(property, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const properties = await prisma.property.findMany();

    return NextResponse.json(properties);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
