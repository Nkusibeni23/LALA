import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const bookings = await prisma.booking.findMany({
      where: { renterId: session.user.id },
      include: { property: true },
    });

    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "RENTER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { propertyId, checkIn, checkOut } = await req.json();

    // Validate input
    if (!propertyId || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkInDate >= checkOutDate) {
      return NextResponse.json(
        { error: "Invalid check-in and check-out dates" },
        { status: 400 }
      );
    }

    // Check for overlapping bookings
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        propertyId,
        status: { not: "CANCELED" },
        OR: [
          { checkIn: { lte: checkOutDate }, checkOut: { gte: checkInDate } },
        ],
      },
    });

    if (overlappingBooking) {
      return NextResponse.json(
        { error: "Property already booked for selected dates" },
        { status: 409 }
      );
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        propertyId,
        renterId: session.user.id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        status: "PENDING",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
