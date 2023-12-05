import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary"
import Post from "@/schema/post";
import { checkAuth, connectDB, expoClode } from "@/features/features";
import User from "@/schema/user";



export async function POST(req: NextRequest) {

    try {

        let userId = await checkAuth()

        if (!userId) {
            NextResponse.json({ success: false, message: "login first" })
        }

        expoClode()
        connectDB()

        const data = await req.formData()

        const image = data.get("file") as unknown as File;
        const caption = data.get("caption")

        let bytes = await image.arrayBuffer()

        const mycloud = await cloudinary.v2.uploader.upload_stream({ resource_type: "auto" }, async (error, result) => {
            if (error) {
                return NextResponse.json({ success: false });
            }

            const user = await User.findById(userId._id)


            let post = await Post.create({
                caption,
                image: {
                    public_id: result?.public_id,
                    secure_url: result?.secure_url
                },
                owner: userId._id
            })

            user.posts.unshift(post._id);

            await user.save();

        }).end(Buffer.from(bytes));

        return NextResponse.json("post saved")

    } catch (error) {
      return  NextResponse.json(error)
    }
}



export async function GET() {
    try {
        await connectDB();
        let user = await checkAuth();

        if (!user) {
            return NextResponse.json({ success: false, message: 'Please login first' });
        }

        // Get the user's friends
        const userWithFriends = await User.findById(user._id).populate('friends');

        // Extract friend IDs from the user's friend list
        const friendIds = userWithFriends.friends.map((friend:any) => friend._id);

        // Include the user's ID in the friend list
        friendIds.push(user._id);

        // Find posts where the owner is in the friend list
        const posts = await Post.find({ owner: { $in: friendIds } }).populate('owner likes comments.user');

        return NextResponse.json(posts.reverse());
    } catch (error) {
        return NextResponse.json(error);
    }
}
