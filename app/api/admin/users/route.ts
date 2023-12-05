import { checkAdmin, connectDB } from "@/features/features";
import User from "@/schema/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    let admin = await checkAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "only admin can access" },
        { status: 404 }
      );
    }
    await connectDB(); // Assuming connectDB returns a promise, await it

    const users = await User.find();

    if (!users) {
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
