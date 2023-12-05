import { connectDB } from "@/features/features";
import Post from "@/schema/post";
import { NextResponse } from "next/server";


export async function POST(req: Request) {

    try {
        connectDB()

        const { postId, userId } = await req.json()     
        
        let post = await Post.findById(postId);

        if (!post) {
            return NextResponse.json({ message: 'Post not found' });
        }

        if (post.likes.includes(userId)) {
            const index = post.likes.indexOf(userId);
      
            post.likes.splice(index, 1);
      
            await post.save();
      
            return NextResponse.json({
              success: true,
              message: "Post Unliked",
            });
          } else {
            post.likes.push(userId);
      
            await post.save();
      
            return NextResponse.json({
              success: true,
              message: "Post Liked",
            });
          }
    } catch (error) {
       return NextResponse.json(error)
    }

}