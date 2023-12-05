import { connectDB } from "@/features/features";
import Post from "@/schema/post";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
  try {
    const postId = req.url.split("/api/post/searchpost/")[1];
    if (!postId) {
    return  NextResponse.json({ success: false, message: "not found" });
    }
    await connectDB();

    const post = await Post.findById(postId);

    if(!post){
      return  NextResponse.json({ success: false, message: "Post not found" });
    }
  return  NextResponse.json(post)
  } catch (error) {
   return NextResponse.json({success:false , error})
  }
}
