import { checkAuth, connectDB } from "@/features/features"
import User from "@/schema/user"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
       connectDB()
 
       let user = await checkAuth()
 
       if (!user) {
          return NextResponse.json({ message: "please login first" })
       }
 
       const { userId } = await req.json()
       
       const receiverId = user._id
 
       const receiver = await User.findById(receiverId);
       
       const sender = await User.findById(userId);
 
       if (!sender || !receiver) {
          return NextResponse.json({ message: 'User not found' });
       }

       const sernderId = sender._id.toString()
 
       // Check if the friend request exists
       const requestIndex = receiver.friendRequests.findIndex((request: string | any) => request.sender == sernderId )
 
       if (requestIndex === -1) {
          return NextResponse.json({ error: 'Friend request not found' });
       }
       // Remove friend request
       receiver.friendRequests.splice(requestIndex, 1);
       // Save changes
       await receiver.save();
 
       return NextResponse.json({ message: 'Friend request removed successfully' });
    } catch (error) {
       return NextResponse.json({ message: 'Internal server error', error });
    }
 }