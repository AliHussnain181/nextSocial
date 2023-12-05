"use client";
import React, { useEffect, ChangeEvent, useState } from "react";
import { RxCross1, RxDotsHorizontal } from "react-icons/rx";
import { BiLike } from "react-icons/bi";
import { GoComment } from "react-icons/go";
import { TbShare3 } from "react-icons/tb";
import { AiFillLike } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  createComment,
  fetchLikes,
  fetchOwnPosts,
  fetchPosts,
} from "@/store/Slices/postSlice";
import { AppDispatch } from "@/store/store";
import { redirect, useRouter } from 'next/navigation'
import Image from "next/image";
import Link from "next/link";

interface RootState {
  post: {
    posts: any[];
    ownPost: any[];
    loading: boolean;
    error: string | null;
  };
}

const Posts = () => {
  const dispatch: AppDispatch = useDispatch();
  const { ownPost, posts, error }: any = useSelector(
    (state: RootState) => state.post
  );
  const [openCommentForPostId, setOpenCommentForPostId] = useState<
    string | null
  >(null);
  const [comments, setComments] = useState("");
  const [commentedPostId, setCommentedPostId] = useState<string | null>(null);

  const userId = ownPost._id;

  const openCommentSection = (postId: string) => {
    setOpenCommentForPostId(postId);
    setCommentedPostId(postId);
  };

  const closeCommentSection = () => {
    setOpenCommentForPostId(null);
  };


  const submitComment = async (
    e: React.FormEvent<EventTarget & HTMLButtonElement>
  ) => {
    e.preventDefault();
    await dispatch(createComment({ comments, commentedPostId, userId }));
    await dispatch(fetchPosts());
    setComments("");
  };

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchOwnPosts());
  }, [dispatch]);

  const submitLike = async (postId: string) => {
    try {
      await dispatch(fetchLikes({ postId, userId }));
      await dispatch(fetchPosts());
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
    const minutes = Math.floor(timeDifference / (1000 * 60));

    if (minutes < 60) {
      // If less than 1 hour, display minutes
      return `${minutes} minutes ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hours ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 30) {
      return `${days} days ago`;
    }

    const months = Math.floor(days / 30);
    return `${months} months ago`;
  }

  const router = useRouter()

  const { isAuthenticated  } = useSelector((state: any) => state.user);


  const [showFullCaption, setShowFullCaption] = useState(false);

  const handleClick = () => {
    setShowFullCaption(!showFullCaption);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }    
  }, [isAuthenticated,router]);

  return (
    <>
      {
        Array.isArray(posts) && posts.length > 0 ? (
          posts.map((dt: any, index: any) => (
            <div
              key={index}
              className="w-[80vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[38vw] mx-auto mt-24 cursor-pointer mb-3 shadow-xl bg-white py-3 rounded-lg"
            >
              <div className="flex justify-between items-center mb-5 px-4">
                <div className="flex gap-x-3">
                  <Link href={`/userprofile/${dt.owner._id}`}>
                  <Image
                    src={dt.owner?.avatar.secure_url}
                    alt="pht"
                    className="w-9 h-9 rounded-full"
                    width={500}
                    height={500}
                  />
                  </Link>
                  <div>
                    <p className="text-sm">{dt.owner?.name}</p>
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
                  src={dt.image.secure_url}
                  alt={dt.caption}
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
                        dt.likes.find((id: any) => id._id === userId)
                          ? "text-blue-500"
                          : ""
                      }`}
                    />
                    <p
                      className={`${
                        dt.likes.find((id: any) => id._id === userId)
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
          ))
        ) : (
          <h1 className="text-4xl m-auto">No posts</h1>
        )

      }
    </>
  );
};

export default Posts;
