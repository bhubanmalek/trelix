import { NextRequest, NextResponse } from "next/server";
import { dummyTickets } from "@/lib/data/dummyTickets";

// Get all tickets
export async function GET() {
  try {
    
    return NextResponse.json({
      success: true,
      data: dummyTickets,
      total: dummyTickets.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

// Create a new ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, expiryDate, label } = body;
    
    // Validate required fields
    if (!title || !description || !expiryDate || !label) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const newTicket = {
      id: (dummyTickets.length + 1).toString(),
      title,
      description,
      expiryDate,
      label,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to dummy data (this would be saved to database)
    dummyTickets.push(newTicket);
    
    return NextResponse.json({
      success: true,
      data: newTicket
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}

