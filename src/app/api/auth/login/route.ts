import type { LoginRequest, LoginResponse } from "@/types/auth";
import { NextRequest, NextResponse } from "next/server";

// Dummy user data for testing
const dummyUsers = [
  {
    id: "1",
    email: "user@example.com",
    password: "User123", // hashed
    name: "Basic User",
    role: "user" as const,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "bhuban@example.com",
    password: "User123",
    name: "Regular User",
    role: "user" as const,
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
];

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validate
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user first
    const user = dummyUsers.find(u => u.email === email);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check password
    if (user.password !== password) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate dummy JWT token
    const token = `dummy-jwt-token-${user.id}-${Date.now()}`;

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    const response: LoginResponse = {
      token,
      user: userWithoutPassword,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
