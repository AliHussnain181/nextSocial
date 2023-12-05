"use client";
import {
  createComment,
  deleteFriendReq,
  fetchLikes,
  fetchOwnPosts,
  userProfileData,
} from "@/store/Slices/postSlice";
import { AppDispatch } from "@/store/store";
import { useEffect, useState, ChangeEvent } from "react";
import { FaBookmark, FaList, FaUserFriends } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RxCross1, RxDotsHorizontal } from "react-icons/rx";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { BiLike } from "react-icons/bi";
import { GoComment } from "react-icons/go";
import { TbShare3 } from "react-icons/tb";
import { AiFillLike, AiOutlineDelete } from "react-icons/ai";
import Link from "next/link";
import Image from "next/image";
import { fetchAddFriend } from "@/store/Slices/userSlice";

const UserProfile = ({ params }: any) => {
  interface RootState {
    post: {
      profileValue: any[];
      loading: boolean;
      error: string | null;
    };
  }

  interface userState {
    user: {
      userp: any[];
      loading: boolean;
      error: string | null;
    };
  }

  const { userp }: any = useSelector((state: userState) => state.user);

  const { profileValue, error }: any = useSelector(
    (state: RootState) => state.post
  );

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(userProfileData(params.id));
  }, [dispatch, params.id]);

  const email = String(profileValue.email).split("@")[0];

  const [openCommentForPostId, setOpenCommentForPostId] = useState<
    string | null
  >(null);
  const [comments, setComments] = useState("");
  const [commentedPostId, setCommentedPostId] = useState<string | null>(null); // Add this state variable

  const openCommentSection = (postId: string) => {
    setOpenCommentForPostId(postId);
    setCommentedPostId(postId);
  };

  const closeCommentSection = () => {
    setOpenCommentForPostId(null);
  };

  const userId = profileValue._id;

  const submitComment = async (
    e: React.FormEvent<EventTarget & HTMLButtonElement>
  ) => {
    e.preventDefault();
    await dispatch(createComment({ comments, commentedPostId, userId }));
    await dispatch(userProfileData(params.id));
    setComments("");
  };
  const submitLike = async (postId: string) => {
    try {
      await dispatch(fetchLikes({ postId, userId }));
      await dispatch(userProfileData(params.id));
    } catch (error) {
      console.error("Error while fetching likes:", error);
    }
  };

  function getTimeDifference(timestampString: string): string | null {
    const timestamp = new Date(timestampString);

    if (isNaN(timestamp.getTime())) {
      console.error("Invalid timestamp");
      return null;
    }

    const currentDateTime = new Date();
    const timeDifference = currentDateTime.getTime() - timestamp.getTime();
    // Calculate hours
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));

    if (hours < 24) {
      return `${hours} hours ago`;
    }
    // Calculate days
    const days = Math.floor(hours / 24);

    if (days < 30) {
      return `${days} days ago`;
    }
    // Calculate months
    const months = Math.floor(days / 30);
    return `${months} months ago`;
  }

  const addFriendRequest = async () => {
    try {
      await dispatch(fetchAddFriend({ userId }));
      await dispatch(userProfileData(params.id));
    } catch (error) {
      console.error("Error while fetching likes:", error);
    }
  };

  const profileValueId = params.id;

  const deleteFriend = async () => {
    try {
      await dispatch(deleteFriendReq({ profileValueId }));
      await dispatch(userProfileData(params.id));
    } catch (error) {
      console.error("Error while fetching likes:", error);
    }
  };

  const verifyfriend = profileValue?.friends?.some(
    (friend: any) => friend === userp?.user?._id
  );

  const [showFullCaption, setShowFullCaption] = useState(false);

  const handleClick = () => {
    setShowFullCaption(!showFullCaption);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto mt-20">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-2 bg-gray-800">
          <div className="flex items-center justify-between"></div>
        </div>

        <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
              <div className="rounded-full bg-gray-500 w-12 h-12 flex items-center justify-center">
                <Image
                  src={profileValue.avatar?.secure_url}
                  alt="profile"
                  className="rounded-full w-12 h-12 object-cover"
                  width={500}
                  height={500}
                />
              </div>
              <div className="ml-4">
                <h1 className="text-sm font-medium text-black">
                  {profileValue.name}
                </h1>
                <p className="text-sm text-gray-700">{email}</p>
              </div>
            </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Posts</p>
            <p className="text-lg font-medium text-gray-900">
              {profileValue.posts?.length}
            </p>
          </div>
          {verifyfriend ? (
            <button
              onClick={deleteFriend}
              className="text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <AiOutlineDelete className="mr-2" />
              Delete Friends
            </button>
          ) : (
            <button
              onClick={addFriendRequest}
              className="text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <BsFillPersonPlusFill className="mr-2" />
              Add Friends
            </button>
          )}
        </div>
        <div className="px-4 py-2 bg-gray-800">
          <div className="flex items-center justify-between"></div>
        </div>
      </div>
      {profileValue?.posts?.map((dt: any, index: any) => (
        <div
          key={index}
          className="w-[80vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[38vw] mx-auto mt-24 cursor-pointer mb-3 shadow-xl bg-white py-3 rounded-lg"
        >
          <div className="flex justify-between items-center mb-5 px-4">
            <div className="flex gap-x-3">
              <Image
                src={profileValue.avatar?.secure_url}
                alt="pht"
                className="w-9 h-9 rounded-full"
                width={500}
                height={5000}
              />
              <div>
                <p className="text-sm">{profileValue.name}</p>
                <p className="text-xs">{getTimeDifference(dt.createdAt)}</p>
              </div>
            </div>
            <div className="flex gap-x-4 mx-6 text-xl">
              <RxDotsHorizontal />
              <RxCross1 />
            </div>
          </div>
          <div>
            <div className="px-4 pb-2">
              <h1 className="text-[15px] line-clamp-2">
                {showFullCaption ? dt.caption : dt.caption.slice(0, 50)}
              </h1>
              {dt.caption.length > 50 && (
                <button onClick={handleClick}>
                  {showFullCaption ? "See less" : "See more"}
                </button>
              )}
            </div>
            <Image
              className="mx-auto h-[27rem] w-full"
              src={dt.image?.secure_url}
              alt="post"
              width={1000}
              height={1000}
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2 mx-2">
              <div className="flex items-center gap-x-2">
                <AiFillLike className="bg-blue-600 py-1 px-1 rounded-full text-white text-lg" />
                <p>{dt.likes.length}</p>
              </div>
              <div className="flex items-center mx-1 gap-x-5 text-center text-[15px]">
                <div className="flex items-center gap-x-1">
                  <p>{dt.comments.length}</p>
                  <GoComment className="text-xl" />
                </div>
                <div className="flex items-center  gap-x-1">
                  <p>690</p>
                  <TbShare3 className="text-xl" />
                </div>
              </div>
            </div>
            <hr />
            <div className="flex items-center justify-around text-[16px] mt-2">
              <div
                onClick={() => submitLike(dt._id)}
                className={`flex items-center gap-x-1`}
              >
                <BiLike
                  className={`text-[21px] ${
                    dt.likes?.find((id: any) => id === userId)
                      ? "text-blue-500"
                      : ""
                  }`}
                />
                <p
                  className={`${
                    dt.likes?.find((id: any) => id === userId)
                      ? "text-blue-500"
                      : ""
                  }`}
                >
                  Like
                </p>
              </div>
              <div
                onClick={() => openCommentSection(dt._id)}
                className="flex items-center gap-x-1"
              >
                <GoComment className="text-[21px]" />
                <p>Comment</p>
              </div>
              <div className="flex items-center gap-x-1">
                <TbShare3 className="text-[21px]" />
                <p>Share</p>
              </div>
            </div>
            {openCommentForPostId === dt._id && (
              <div className="w-full h-48 relative">
                <div className="h-36 overflow-y-auto scrollb mx-1">
                  {dt.comments?.map((co: any, i: any) => (
                    <div
                      key={i}
                      className="flex justify-start items-center space-y-3 space-x-3 "
                    >
                      <Image
                        width={100}
                        height={100}
                        className="w-7 h-7 border-[1px] border-black rounded-full"
                        src={co?.user?.avatar?.secure_url}
                        alt="pic"
                      />
                      <div className="bg-slate-200 px-3 py-1  rounded-xl">
                        <p className="text-sm">{co?.user?.name}</p>
                        <p className="text-sm">{co.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-2 w-full flex gap-x-5">
                  <input
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setComments(e.target.value);
                    }}
                    className="border-black border-[1px] outline-0 px-1 w-[70%]"
                    type="text"
                    value={comments}
                  />
                  <button onClick={submitComment} className="w-20">
                    Comment
                  </button>
                  <button onClick={closeCommentSection} className="w-20">
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserProfile;
