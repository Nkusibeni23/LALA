import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { propertyId, checkIn, checkOut } = await req.json();

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

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { hostId: true, price: true },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    if (session.user.role === "HOST" && session.user.id === property.hostId) {
      return NextResponse.json(
        { error: "Hosts cannot book their own properties" },
        { status: 403 }
      );
    }

    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        propertyId,
        status: { in: ["CONFIRMED", "PENDING"] },
        OR: [
          {
            AND: [
              { checkIn: { lte: checkOutDate } },
              { checkOut: { gte: checkInDate } },
            ],
          },
        ],
      },
    });

    if (overlappingBooking) {
      return NextResponse.json(
        {
          error: "Property already booked for selected dates",
        },
        { status: 409 }
      );
    }

    const totalNights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const totalPrice = totalNights * property.price;

    const booking = await prisma.booking.create({
      data: {
        propertyId,
        renterId: session.user.id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        status: "PENDING",
        totalPrice,
      } as Prisma.BookingUncheckedCreateInput,
    });

    await prisma.notification.create({
      data: {
        userId: property.hostId,
        message: `New booking request received for your property`,
        type: "booking_request_host",
        bookingId: booking.id,
        data: {
          checkIn: checkInDate.toISOString(),
          checkOut: checkOutDate.toISOString(),
          totalPrice: totalPrice,
        },
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

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
  } catch (error) {
    console.error("Booking fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
