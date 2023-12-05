import Post from "@/schema/post";
import User from "@/schema/user";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { checkAuth, connectDB, expoClode } from "@/features/features";

interface Response {
  params: {
    id: string;
  };
}

export async function DELETE(req: Request,res:Response) {
  try {
      let userId = await checkAuth();

      if (!userId) {
          return NextResponse.json({ success: false, message: "login first" });
      }

      connectDB();
      expoClode();

      // Assuming you pass the post ID as a parameter in the request URL
      const postId = res.params.id;

      // Find the post by ID
      const post = await Post.findById(postId);      

      // Check if the post exists
      if (!post) {
          return NextResponse.json({ success: false, message: "post not found" });
      }

      // Check if the user is the owner of the post
      if (post.owner.toString() !== userId._id.toString()) {
          return NextResponse.json({ success: false, message: "unauthorized to delete this post" });
      }

      // Delete the post from Cloudinary
      await cloudinary.v2.uploader.destroy(post.image.public_id);

      // Remove the post from the user's posts array
      const user = await User.findById(userId._id);
      

      user.posts = user.posts.filter((userPostId:string) => userPostId.toString() !== postId.toString());

      await user.save();

      // Delete the post from the database
      await Post.findByIdAndDelete(postId);

      return NextResponse.json({ success: true, message: "post deleted" });
  } catch (error) {
      return NextResponse.json({ success: false, error });
  }
}


export async function PUT(req: Request, res: Response):Promise<NextResponse | any> {
  try {
    let userId = await checkAuth();

    if (!userId) {
      return NextResponse.json({ success: false, message: "Login first" });
    }

    expoClode();
    connectDB();

    const data = await req.formData();

    const postId = res.params.id; // Assuming you pass the post ID in the URL

    const image = data.get("file") as unknown as File;
    const caption = data.get("caption");

    // Validation
    if (!image || !caption) {
      return NextResponse.json({ success: false, message: "Invalid data. Please provide both image and caption." });
    }

    let bytes = await image.arrayBuffer();

    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json({ success: false, message: "Post not found" });
    }

    await cloudinary.v2.uploader.destroy(post.image.public_id);

    const mycloud = await cloudinary.v2.uploader.upload_stream({ resource_type: "auto" }, async (error, result) => {
      if (error) {
        return NextResponse.json({ success: false, message: "Error uploading image" });
      }

      // Update post details
      post.caption = caption;
      post.image = {
        public_id: result?.public_id,
        secure_url: result?.secure_url,
      };

      await post.save();

      return NextResponse.json({ success: true, message: "Post updated" });

    }).end(Buffer.from(bytes));

  } catch (error) {
    return NextResponse.json({ success: false, message:error });
  }
}
