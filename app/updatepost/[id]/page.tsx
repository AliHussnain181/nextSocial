"use client";
import { UpdatePost, searchPost } from "@/store/Slices/postSlice";
import { AppDispatch } from "@/store/store";
import Image from "next/image";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface PageProps {
  params: any; // Replace 'any' with the actual type of params
}

const Page: React.FC<PageProps> = ({ params }) => {
  const [caption, setCaption] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(searchPost(params.id));
  }, [dispatch, params.id]);

  const { updatePost } = useSelector((state: any) => state.post);

  useEffect(() => {
    if (updatePost) {
      setCaption(updatePost.caption);
    }
  }, [updatePost]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
    }
  };

  const handleCaptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCaption(e.target.value);
  };  

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (image) {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("file", image);

      dispatch(UpdatePost({ formData, postId: params.id }));

      setCaption("");
      setImage(null);
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto mt-20 p-4 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold mb-4">Create a Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="caption" className="block text-gray-700">
              Caption:
            </label>
            <input
              type="text"
              id="caption"
              value={caption}
              onChange={handleCaptionChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700">
              Image:
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Create Post
            </button>
          </div>
        </form>
        {(image || updatePost?.image?.secure_url) && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Preview Image:</h3>
            <Image
              src={
                (image && URL.createObjectURL(image)) ||
                updatePost?.image?.secure_url
              }
              alt="Preview"
              className="max-w-full h-auto"
              width={1000}
              height={1000}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Page;
