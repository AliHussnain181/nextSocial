import mongoose from "mongoose";
import cloudinary from "cloudinary";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/schema/user";

export const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URI!,{
      dbName:"nextsocial"
    })
    .then(() => console.log("Database connected"))
    .catch((error) => {
      console.error(error);
    });
};
export const expoClode = () => {
  cloudinary.v2.config({
    cloud_name: process.env.C_N,
    api_key: process.env.A_P,
    api_secret: process.env.A_S,
  });
};

export const generateToken = (_id: any) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET!);
};

export const checkAuth = async () => {
  try {
    const token = cookies().get("social")?.value;

    if (!token) {
      console.error("Token is undefined");
      return null;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET is not defined");
      return null;
    }

    const decoded = jwt.verify(token, secret) as { _id: string };

    const user = await User.findById(decoded._id);    

    return user;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error("Token has expired:", error.message);
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error("Token verification failed:", error.message);
    } else {
      console.error("Unexpected error during token verification:", error);
    }

    return null;
  }
};


export const checkAdmin = async () => {
  const cookie = cookies();

  let token = cookie.get("social")?.value;

  if (!token) {
    throw new Error("Token not found");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string };

  const user = await User.findById(decoded._id);

  return user && user.role === "admin";
};
