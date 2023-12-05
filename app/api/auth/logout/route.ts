import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
    try {        
        cookies().delete('social')
        
        return NextResponse.json({ message: "your account logout",success: true}, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "internal server error", error,success: false}, { status: 500 })
    }
}
