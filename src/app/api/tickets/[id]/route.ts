import { dummyTickets } from "@/lib/data/dummyTickets";
import { NextRequest, NextResponse } from "next/server";

// Update a ticket
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, description, expiryDate, label } = body;

    // Find ticket index
    const ticketIndex = dummyTickets.findIndex(ticket => ticket.id === id);


    const updatedTicket = {
      ...dummyTickets[ticketIndex],
      ...(title && { title }),
      ...(description && { description }),
      ...(expiryDate && { expiryDate }),
      ...(label && { label }),
      updatedAt: new Date().toISOString()
    };

    dummyTickets[ticketIndex] = updatedTicket;

    return NextResponse.json({
      success: true,
      data: updatedTicket
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}

