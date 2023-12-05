import { checkAdmin, connectDB } from "@/features/features";
import Post from "@/schema/post";
import { NextResponse } from "next/server";

export  async function GET() {
    try {

       let admin = await checkAdmin()

       if(!admin){
        return NextResponse.json({message:"only admin can access"},{status:404})
       }

        await connectDB(); // Assuming connectDB returns a promise, await it

        const posts = await Post.find();

        if (!posts) {
            return NextResponse.json({ error: "No posts found" }, { status: 404 });
        }

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
