import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const protectedRoutes = createRouteMatcher(["/me(.*)", "/post(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (!userId && protectedRoutes(req)) {
    const signInUrl = new URL("/error", req.url);
    return NextResponse.redirect(signInUrl);
  }

  if (userId && req.nextUrl.pathname === "/") {
    const hasPersona = req.cookies.get("selectedPersona");
    if (hasPersona) {
      return NextResponse.redirect(new URL("/main", req.url));
    } else {
      return NextResponse.redirect(new URL("/onboard", req.url));
    }
  }

  return NextResponse.next();
});
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
