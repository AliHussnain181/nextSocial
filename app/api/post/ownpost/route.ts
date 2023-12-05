import { checkAuth, connectDB } from "@/features/features";
import User from "@/schema/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB()

    let user = await checkAuth()

    if (!user) {
      return NextResponse.json({ message: "please login first" })
    }

    let userWithPost =  await User.findById(user._id).populate({
      path:"posts",
      populate:{
        path:"comments.user",
        model:"User"
      }
    }) 
    return NextResponse.json(userWithPost)

  } catch (error) {
    return NextResponse.json(error)
  }
}