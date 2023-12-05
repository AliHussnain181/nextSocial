"use client";
import React, { useState, FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError , loginAsync } from "@/store/Slices/userSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppDispatch } from "@/store/store";
import { toast } from 'react-hot-toast';


function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");


  const dispatch: AppDispatch = useDispatch();

  const { isAuthenticated,error,user } = useSelector((state: any) => state.user);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Handle form submission here
      await dispatch(loginAsync({ email, password }));
    } catch (error) {
      console.error(error);
    }
  };

  const router = useRouter()

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="w-full max-w-md p-4 bg-white rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Login</h2>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          >
            Login
          </button>
        </div>
        <div className="text-center">
        <Link
             href="/register"
              className="inline-block align-baseline font-medium text-blue-500 hover:text-blue-800"
            >
              Not have an account? Register
            </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
