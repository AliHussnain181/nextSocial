import { connectDB } from "@/features/features";
import Post from "@/schema/post";
import { NextResponse } from "next/server";

export  async function POST(req: Request) {
  try {
    await connectDB(); // Ensure the database is connected

    const { comments, commentedPostId, userId } = await req.json(); // Use req.body instead of req.json()

    let post = await Post.findById(commentedPostId);

    if (!post) {
      return NextResponse.json({ message: 'Post not found' });
    }

    const newComment = {
      user: userId,
      comment: comments, // Assuming comments is the comment text
    };
    
    post.comments.unshift(newComment);

    await post.save();

    return NextResponse.json("Comment added successfully");
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add comment" });
  }
}