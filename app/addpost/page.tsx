"use client"
import { createPost } from '@/store/Slices/postSlice';
import { AppDispatch } from '@/store/store';
import Image from 'next/image';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useDispatch } from 'react-redux';

interface PostFormProps {}

function PostForm(props: PostFormProps) {
  const [caption, setCaption] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);

  const handleCaptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCaption(e.target.value);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
    }
  };

  const dispatch: AppDispatch = useDispatch();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (image) {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('file', image);

      dispatch(createPost(formData));

      setCaption('');
      setImage(null);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Create a Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="caption" className="block text-gray-700">Caption:</label>
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
          <label htmlFor="image" className="block text-gray-700">Image:</label>
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
      {image && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Preview Image:</h3>
          <Image
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="max-w-full h-auto"
            width={1000}
            height={1000}
          />
        </div>
      )}
    </div>
  );
}

export default PostForm;
