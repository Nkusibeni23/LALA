import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
    });
    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "HOST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const property = await prisma.property.findUnique({
      where: { id: params.id },
    });
    if (!property || property.hostId !== session.user.id) {
      return NextResponse.json(
        { error: "Property not found or unauthorized" },
        { status: 404 }
      );
    }

    const data = await req.json();
    const updatedProperty = await prisma.property.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(updatedProperty);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "HOST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const property = await prisma.property.findUnique({
      where: { id: params.id },
    });
    if (!property || property.hostId !== session.user.id) {
      return NextResponse.json(
        { error: "Property not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.property.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Property deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
