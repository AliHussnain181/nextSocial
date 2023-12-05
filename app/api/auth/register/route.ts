import { NextRequest, NextResponse } from "next/server";
import cloudinary, { UploadApiResponse } from "cloudinary";
import User from "@/schema/user";
import { connectDB, expoClode, generateToken } from "@/features/features";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

// Function to handle file upload
async function handleFileUpload(file: Buffer): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result as UploadApiResponse);
      }
    }).end(file);
  });
}

// Function to create a user
async function createUser(name: string, email: string, password: string, avatar: UploadApiResponse) {
  const hashPassword = await bcrypt.hash(password, 10);
  return User.create({
    name,
    email,
    password: hashPassword,
    avatar: {
      public_id: avatar.public_id,
      secure_url: avatar.secure_url
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get('file') as unknown as File;
    const name = data.get('name') as string;
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    if (!file || !name || !email || !password) {
      return NextResponse.json({ success: false, message: 'Missing required data' });
    }

    connectDB();
    expoClode();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ success: false, message: 'User already exists with this email' });
    }

    const result = await handleFileUpload(Buffer.from(await file.arrayBuffer()));
    const user = await createUser(name, email, password, result);

    const token = generateToken(user._id);

    cookies().set("social", token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 15 * 24 * 60 * 60 * 1000
    });

    return NextResponse.json({ success: true, message: 'Registered successfully' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, message: 'An error occurred' });
  }
}
