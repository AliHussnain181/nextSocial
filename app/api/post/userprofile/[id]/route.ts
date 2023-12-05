import { checkAuth, connectDB } from "@/features/features";
import User from "@/schema/user";
import { NextRequest, NextResponse } from "next/server";

interface Response {
    params: {
        id: string;
    };
}

export async function GET(req: NextRequest, res: Response) {
    try {
        await connectDB()

        let user = await checkAuth()

        if (!user) {
            return NextResponse.json({ message: "please login first" })
        }        

        let userProfile = await User.findById(res.params.id).populate({
            path: 'posts',
            populate: {
                path: "comments.user",
                model: "User"
            }
        })
        return NextResponse.json(userProfile)

    } catch (error) {
        return NextResponse.json({message:"server error",error})
    }
}