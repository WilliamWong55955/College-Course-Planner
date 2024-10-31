import {
    clerkMiddleware,
    createRouteMatcher
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

// Middleware to handle protected routes
// export default clerkMiddleware((auth, request) => {
//     if (isProtectedRoute(request)) auth().protect();
// });

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
  }
