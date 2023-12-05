import { checkAuth, connectDB } from "@/features/features";
import User from "@/schema/user";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const { friendId } = await req.json();

  connectDB();

  let user = await checkAuth();

  if (!user) {
    return NextResponse.json({ message: "please login first" });
  }
  try {
    // Find the receiver
    const receiverId = user._id;

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return NextResponse.json({ error: "User not found" });
    }

    // Find the friend request and update its status
    const friendRequest = receiver.friendRequests.find((request: any) =>
      request.sender.equals(friendId)
    );

    if (!friendRequest) {
      return NextResponse.json({ error: "Friend request not found" });
    }

    friendRequest.status = "accepted";

    // Add sender to the receiver's friends and vice versa
    receiver.friends.push(friendId);
    const sender = await User.findById(friendId);
    sender.friends.push(receiverId);

    // Remove the friend request
    receiver.friendRequests = receiver.friendRequests.filter(
      (request: any) => !request.sender.equals(friendId)
    );

    // Save changes
    await Promise.all([receiver.save(), sender.save()]);

    return NextResponse.json({
      message: "Friend request accepted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" });
  }
}

export async function POST(req: Request) {
  try {
    connectDB();

    let user = await checkAuth();

    if (!user) {
      return NextResponse.json({ message: "please login first" });
    }

    let userId = user._id;

    const { profileValueId } = await req.json();    

    // Find the user and friend
    const userM = await User.findById(userId);
    const friend = await User.findById(profileValueId);

    if (!userM || !friend) {
      return NextResponse.json({ error: "User or friend not found" });
    }

    // Remove friend from user's friends and vice versa
    // userM.friends = userM.friends.filter((f: any) => !f.equals(profileValueId));
    // friend.friends = friend.friends.filter((f: any) => !f.equals(userId));

    userM.friends = userM.friends.filter((f: any) =>  !f == profileValueId);
    friend.friends = friend.friends.filter((f: any) => !f == userId);

    // Save changes
    await Promise.all([userM.save(), friend.save()]);

    return NextResponse.json({ message: "Friend deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" });
  }
}
