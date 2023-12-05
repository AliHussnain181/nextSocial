import { checkAuth } from "@/features/features";
import { NextResponse } from "next/server";

export async function GET() {

    try {
        let user = await checkAuth()

        if (!user) return NextResponse.json("Login First", { status: 401 });
        
        return NextResponse.json({
            success: true,
            user,
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error, message: "internal server error" }, { status: 500 })
    }

}