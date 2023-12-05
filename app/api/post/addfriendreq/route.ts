import { checkAuth, connectDB } from "@/features/features";
import User from "@/schema/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
   try {
      connectDB()

      let user = await checkAuth()

      if (!user) {
         return NextResponse.json({ message: "please login first" })
      }

      const { userId } = await req.json()

      const senderId = user._id


      const sender = await User.findById(senderId);
      const receiver = await User.findById(userId);

      if (!sender || !receiver) {
         return NextResponse.json({ message: 'User not found' });
      }

      // Check if the friend request already exists
      if (receiver.friendRequests.some((request:string | any) => request.sender.equals(senderId))) {
         return NextResponse.json({ error: 'Friend request already sent' });
      }

      // Add friend request
      receiver.friendRequests.push({ sender: senderId });

      // Save changes
      await receiver.save();

      return NextResponse.json({ message: 'Friend request sent successfully' });
   } catch (error) {
      return NextResponse.json({ message: 'Internal server error', error });
   }

}
