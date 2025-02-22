import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET({ params }: { params: { propertyId: string } }) {
  const startTime = Date.now();

  try {
    const allBookingsInDB = await prisma.booking.findMany({
      where: {
        propertyId: params.propertyId,
      },
    });

    const activeBookings = await prisma.booking.findMany({
      where: {
        propertyId: params.propertyId,
        status: { in: ["CONFIRMED", "PENDING"] },
      },
    });

    const statusCounts = allBookingsInDB.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json(activeBookings);
  } catch (error) {
    console.error("Error in GET bookings:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    const endTime = Date.now();
    console.log(`[${endTime}] Request completed in ${endTime - startTime}ms`);
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();

    const existingBookings = await prisma.booking.findMany({
      where: {
        propertyId: body.propertyId,
        status: { in: ["CONFIRMED", "PENDING"] },
        OR: [
          {
            AND: [
              { checkIn: { lte: new Date(body.checkIn) } },
              { checkOut: { gte: new Date(body.checkIn) } },
            ],
          },
          {
            AND: [
              { checkIn: { lte: new Date(body.checkOut) } },
              { checkOut: { gte: new Date(body.checkOut) } },
            ],
          },
        ],
      },
    });

    if (existingBookings.length > 0) {
      return NextResponse.json(
        { error: "Dates already booked" },
        { status: 409 }
      );
    }

    const newBooking = await prisma.booking.create({
      data: {
        propertyId: body.propertyId,
        renterId: body.userId,
        checkIn: new Date(body.checkIn),
        checkOut: new Date(body.checkOut),
        totalPrice: body.totalPrice,
        status: "PENDING",
      },
    });

    return NextResponse.json(newBooking);
  } catch (error) {
    console.error("Error in POST booking:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    const endTime = Date.now();
    console.log(`[${endTime}] Request completed in ${endTime - startTime}ms`);
    await prisma.$disconnect();
  }
}
