import Post from "@/schema/post";
import User from "@/schema/user";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { checkAdmin, connectDB, expoClode } from "@/features/features";


export async function DELETE(req: Request, res: Response){

    const userId  = req.url.split("/api/admin/")[1]    
  
    try {

      await connectDB()

      expoClode()
      // Check if the requesting user is an admin (you may want to implement proper authentication and authorization)
      const requestingUserIsAdmin = await checkAdmin();  // Change this to your actual admin check logic
  
      if (!requestingUserIsAdmin) {
        return NextResponse.json({ error: 'Unauthorized access' });
      }
  
      // Find the user and delete their posts
      const user = await User.findById(userId);
  
      if (!user) {
        return NextResponse.json({ error: 'User not found' });
      }
  
      // Delete user's posts along with associated Cloudinary images
      for (const postId of user.posts) {
        const post = await Post.findById(postId);

  
        if (post && post.image.public_id) {
          // Delete Cloudinary image associated with the post
          await cloudinary.v2.uploader.destroy(post.image.public_id);
        }
  
        // Delete the post
        await Post.findByIdAndDelete(postId);
      }
  
      // Delete Cloudinary image associated with the user's avatar
      if (user.avatar && user.avatar.public_id) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      }
      // Delete the user
      await User.findByIdAndDelete(userId);
  
     return NextResponse.json({ message: 'User, associated posts, and Cloudinary images deleted successfully' });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Internal server error' });
    }
}
  


