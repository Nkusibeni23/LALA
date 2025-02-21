import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        propertyId: params.propertyId,
        status: {
          in: ["CONFIRMED", "PENDING"],
        },
      },
      select: {
        checkIn: true,
        checkOut: true,
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching property bookings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
