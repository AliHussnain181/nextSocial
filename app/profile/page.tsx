"use client";
import {
  createComment,
  deletePost,
  fetchLikes,
  fetchOwnPosts,
  fetchPosts,
} from "@/store/Slices/postSlice";
import { AppDispatch } from "@/store/store";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import {
  FaUser,
  FaEdit,
  FaBookmark,
  FaList,
  FaUserFriends,
  FaCamera,
  FaVideo,
  FaEnvelope,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RxCross1, RxDotsHorizontal } from "react-icons/rx";
import { BiLike } from "react-icons/bi";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { GoComment } from "react-icons/go";
import { TbShare3 } from "react-icons/tb";
import { AiFillLike } from "react-icons/ai";
import Link from "next/link";
import Image from "next/image";

const Profile = () => {
  interface RootState {
    post: {
      ownPost: any[];
      loading: boolean;
      error: string | null;
    };
  }

  const { ownPost, error }: any = useSelector((state: RootState) => state.post);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOwnPosts());
    dispatch(fetchPosts());
  }, [dispatch]);

  const email = String(ownPost.email).split("@")[0];

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

  const userId = ownPost._id;

  const submitComment = async (
    e: React.FormEvent<EventTarget & HTMLButtonElement>
  ) => {
    e.preventDefault();
    await dispatch(createComment({ comments, commentedPostId, userId }));
    await dispatch(fetchOwnPosts());
    setComments("");
  };
  const submitLike = async (postId: string) => {
    try {
      await dispatch(fetchLikes({ postId, userId }));
      await dispatch(fetchOwnPosts());
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
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const postDeleteShow = (postId: any) => {
    setSelectedPostId(postId);
    setShowLogoutConfirmation(true);
  };
  const cancelPostDelete = () => {
    setShowLogoutConfirmation(false);
  };

  const postDeleteOk = async (e: any) => {
    e.preventDefault();
    await dispatch(deletePost(selectedPostId));
    await dispatch(fetchOwnPosts());
    setShowLogoutConfirmation(false);
    setSelectedPostId(null);
  };

  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const [showFullCaption, setShowFullCaption] = useState(false);

  const handleClick = () => {
    setShowFullCaption(!showFullCaption);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="w-full max-w-md mx-auto mt-20">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="rounded-full bg-gray-500 w-12 h-12 flex items-center justify-center">
                  <Image
                    src={ownPost.avatar?.secure_url}
                    alt="profile"
                    className="rounded-full w-12 h-12 object-cover"
                    width={500}
                    height={500}
                  />
                </div>
                <div className="ml-4">
                  <h1 className="text-sm font-medium text-white">
                    {ownPost.name}
                  </h1>
                  <p className="text-sm text-gray-300">{email}</p>
                </div>
              </div>
              <div className="flex items-center">
                
                <Link
                  href={"/addpost"}
                  className="ml-4 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium text-white"
                >
                  <FaBookmark className="mr-2" />
                  Add Post
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-2 bg-gray-100">
          
          </div>
          <div className="flex items-center justify-between px-4 py-2">
          <div>
              <p className="text-sm text-gray-600 font-medium">Posts</p>
              <p className="text-lg font-medium text-gray-900">
                {ownPost.posts?.length}
              </p>
            </div>
           
            <button className="text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer">
              <BsFillPersonPlusFill className="mr-2" />
              Add Friends
            </button>
          </div>
        </div>
        {ownPost?.posts?.map((dt: any, index: any) => (
          <div
            key={index}
            className="w-[80vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[38vw] mx-auto mt-24 cursor-pointer mb-3 shadow-xl bg-white py-3 rounded-lg"
          >
            <div className="flex justify-between items-center mb-5 px-4">
              <div className="flex gap-x-3">
                <Image
                  src={ownPost.avatar?.secure_url}
                  alt="pht"
                  className="w-9 h-9 rounded-full"
                  width={500}
                  height={500}
                />
                <div>
                  <p className="text-sm">{ownPost.name}</p>
                  <p className="text-xs">{getTimeDifference(dt.createdAt)}</p>
                </div>
              </div>
              <div className="flex gap-x-4 mx-6 text-xl">
                <div className="relative inline-block">
                  <button onClick={toggleOptions}>
                    <RxDotsHorizontal className="text-gray-500 hover:text-gray-700 cursor-pointer" />
                  </button>

                  {showOptions === dt._id && (
                    <div className="absolute right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg">
                      <Link href={`/updatepost/${dt._id}`} className="p-2  w-full hover:bg-gray-100 cursor-pointer">
                        update
                      </Link>
                    </div>
                  )}
                </div>{" "}
                <RxCross1 onClick={() => postDeleteShow(dt._id)} />
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
                alt="owner"
                width={1000}
                height={1000}
              />
            </div>
            {showLogoutConfirmation && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-30">
                <div className="bg-white p-4 rounded shadow-md">
                  <p className="text-lg">Are you sure you want post Delete?</p>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={postDeleteOk}
                      className="bg-blue-500 text-white px-4 py-2 mr-2"
                    >
                      OK
                    </button>
                    <button
                      onClick={cancelPostDelete}
                      className="bg-gray-400 text-white px-4 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
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
      {/* {showLogoutConfirmation && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-30">
                    <div className="bg-white p-4 rounded shadow-md">
                        <p className="text-lg">Are you sure you want post Delete?</p>
                        <div className="flex justify-end mt-4">
                            <button onClick={postDeleteOk} className="bg-blue-500 text-white px-4 py-2 mr-2">OK</button>
                            <button onClick={cancelPostDelete} className="bg-gray-400 text-white px-4 py-2">Cancel</button>
                        </div>
                    </div>
                </div>
            )} */}
    </>
  );
};

export default Profile;
