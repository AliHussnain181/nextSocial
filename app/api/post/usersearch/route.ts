import { connectDB } from "@/features/features";
import User from "@/schema/user";
import { NextRequest, NextResponse } from "next/server";
import { URL } from "url";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url ?? "/");
        
        const keyword = searchParams.get("keyword");

        if (!keyword) {
            return NextResponse.json({ message: "Missing 'keyword' parameter" });
        }
        const users = await User.find({
            name: {
                $regex: keyword,
                $options: "i"
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("Error in GET request:", error);
        return NextResponse.json({ message: "Internal server error" });
    }
}
