import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const url = new URL("/", request.url);
    const response = NextResponse.redirect(url);
    
    // Clear the token cookie completely
    response.cookies.delete("token");
    
    // Also set it to expired to ensure it's removed
    response.cookies.set("token", "", { 
        expires: new Date(0), 
        path: "/",
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
    
    return response;
}