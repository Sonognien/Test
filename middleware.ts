import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/membre(.*)", "/api/upload(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const proto = req.headers.get("x-forwarded-proto");
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction && proto === "http") {
    const url = req.nextUrl.clone();
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)"
  ]
};
