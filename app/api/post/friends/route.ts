import { checkAuth, connectDB } from "@/features/features"
import User from "@/schema/user"
import { NextResponse } from "next/server"


export async function GET(req: Request) {
    try {
        connectDB()

        let userp = await checkAuth()

        if (!userp) {
            return NextResponse.json({ message: "please login first" })
        }

        let userId = userp._id

        const user = await User.findById(userId).populate({
            path: "friendRequests.sender",
            select: "name email avatar",  // Adjust the fields you want to retrieve
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" });
        }

        const friendRequests = user.friendRequests.filter((request: string | any) => request.status === "pending");

        return NextResponse.json(friendRequests);
    } catch (error) {
        return NextResponse.json({ message: "internal server error", error })
    }
}