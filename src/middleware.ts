import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const { pathname } = request.nextUrl;

    // If user is logged in and visits auth pages → redirect to dashboard
    if (
        token &&
        (pathname === "/sign-in" ||
            pathname === "/sign-up" ||
            pathname === "/verify" ||
            pathname === "/")
    ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If user is not logged in and tries to access dashboard → redirect to sign-in
    if (!token && pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // otherwise, allow the request
    return NextResponse.next();
}

// Apply middleware only to these paths
export const config = {
    matcher: ["/sign-in", "/sign-up", "/verify/:path*", "/dashboard/:path*"],
};
