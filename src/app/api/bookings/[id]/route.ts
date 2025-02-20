import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "HOST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { status } = await req.json();
    if (!["CONFIRMED", "CANCELED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status update" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        property: true,
        renter: true,
      },
    });

    if (!booking || booking.property.hostId !== session.user.id) {
      return NextResponse.json(
        { error: "Booking not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update the booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: { status },
    });

    const notificationMessage =
      status === "CONFIRMED"
        ? `Your booking for ${booking.property.title} has been approved!`
        : `Your booking for ${booking.property.title} has been declined.`;

    await prisma.notification.create({
      data: {
        userId: booking.renterId,
        message: notificationMessage,
        type: "booking_update",
        bookingId: booking.id,
        data: {
          status,
          checkIn: booking.checkIn.toISOString(),
          checkOut: booking.checkOut.toISOString(),
        },
      },
    });

    await prisma.notification.create({
      data: {
        userId: booking.property.hostId,
        message: `You ${status.toLowerCase()} a booking for ${
          booking.property.title
        }.`,
        type: "booking_update",
        bookingId: booking.id,
        data: {
          status,
          checkIn: booking.checkIn.toISOString(),
          checkOut: booking.checkOut.toISOString(),
        },
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Booking update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
