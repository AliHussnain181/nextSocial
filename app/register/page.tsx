"use client";
import { clearError, registerAsync } from "@/store/Slices/userSlice";
import { AppDispatch } from "@/store/store";
import Image from "next/image";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";

const RegisterForm = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [imagePrev, setImagePrev] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  const { isAuthenticated,error,user } = useSelector((state: any) => state.user);
  const router = useRouter()

 
  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        setImagePrev(reader.result as string);
        setImage(file);
      };
    }
  };

  const dispatch: AppDispatch = useDispatch();

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.append("name", name);
    myForm.append("email", email);
    myForm.append("password", password);
    if (image) {
      myForm.append("file", image);
    }

    dispatch(registerAsync(myForm));
  };
  useEffect(() => {
    if (error) {
      toast.success(error);
      dispatch(clearError());
    }
    if (user && user.message) {
      toast.success(user?.message);
    }
  }, [dispatch, error,user]);  


  useEffect(()=> {
    if (isAuthenticated) {
      router.push("/")
    }
  },[isAuthenticated,router])

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="max-w-md w-full mx-auto">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={submitHandler}
        >
          <div className="text-2xl font-medium text-gray-800 mb-8 text-center">
            Create an Account
          </div>
          <div
            className={`h-44 w-44 mx-auto my-5 ${
              imagePrev.length > 0 ? "block" : "hidden"
            } `}
          >
            <Image
              width={700}
              height={700}
              className="h-[100%] w-full rounded-full"
              src={imagePrev}
              alt="pht"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              name="email"
              placeholder="johndoe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              name="password"
              placeholder="**********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 font-medium">
              Profile Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={changeImageHandler}
              className="form-input mt-1 block w-full"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Register
            </button>
            <Link
             href="/login"
              className="inline-block align-baseline font-medium text-blue-500 hover:text-blue-800"
            >
              Already have an account? Login
            </Link>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">
          &copy;2023 Acme Corp. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
