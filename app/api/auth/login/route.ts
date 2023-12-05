import User from "@/schema/user"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { connectDB, generateToken } from "@/features/features"
import { cookies } from "next/headers"


export async function POST(req: Request) {
    try {
        let { email, password } = await req.json()

        connectDB()

        let user = await User.findOne({ email }).select("+password")
        if (!user) {
          return  NextResponse.json({ success: false, message: "please first register" })
        }
        
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
          return  NextResponse.json({ success: false, message: "Invalid Email or Password" })
        }

        const token = generateToken(user._id);

        cookies().set("social", token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 15 * 24 * 60 * 60 * 1000
        });


      return  NextResponse.json({success: true , message:`${user.name} is login`})
    } catch (error) {
      console.log(error);
      return  NextResponse.json(error)
    }
}