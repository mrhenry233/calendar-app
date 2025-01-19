import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/login", "/register"];

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // except static files and API path
  if (path.startsWith("/_next") || path.startsWith("/api") || path.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.includes(path);

  const cookie = (await cookies()).get("access_token")?.value;

  if (!isPublicRoute && !cookie) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (isPublicRoute && cookie) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}
