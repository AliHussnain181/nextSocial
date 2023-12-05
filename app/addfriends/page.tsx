"use client";
import { acceptFriendReq, fetchFriendReq } from "@/store/Slices/postSlice";
import { removeFriendReq } from "@/store/Slices/userSlice";
import { AppDispatch } from "@/store/store";
import Image from "next/image";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface RootState {
  post: {
    friends: [];
    loading: boolean;
    error: string | null;
  };
}

const AddFriends = () => {
  const dispatch: AppDispatch = useDispatch();

  const { friends, loading, error } = useSelector(
    (state: RootState) => state.post
  );

  useEffect(() => {
    // Dispatch the Redux action to fetch initial friend data and friend requests
    dispatch(fetchFriendReq());
  }, [dispatch]);

  const addFriend = (friendId: string) => {
    dispatch(acceptFriendReq({ friendId }));
    dispatch(fetchFriendReq());
  };
  const removeFriend = (userId:string) => {
    dispatch(removeFriendReq({ userId }));
    dispatch(fetchFriendReq());
  }


  if (!friends || friends.length === 0) {
    return (
      <p className="text-4xl my-60 text-center">No friend requests found.</p>
    );
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container mx-auto my-8 p-8 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">
        People You May Know
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {friends.length > 0 &&
          friends?.map((friend: any, i: any) => (
            <div
              key={i}
              className="bg-white rounded-lg overflow-hidden shadow-md"
            >
              <Image
                src={friend.sender?.avatar?.secure_url}
                alt={friend.sender?.name}
                className="w-full h-56 object-cover rounded-t-lg"
                width={300}
                height={300}
              />
              <div className="p-6">
                <h3 className="text-[17px] font-semibold mb-1">
                  {friend.sender?.name}
                </h3>
                  <button
                    onClick={() => addFriend(friend.sender?._id)} // Pass friend ID to the addFriend function
                    className="mt-2 bg-blue-100 text-blue-600 py-2 px-9 rounded-md mr-3"
                  >
                    Confirm
                  </button>
                  <button
                   onClick={() => removeFriend(friend.sender?._id)}
                   className="mt-2 bg-slate-300 text-black py-2 px-9 rounded-md">
                    Remove
                  </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AddFriends;
