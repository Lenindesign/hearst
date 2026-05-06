import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Storybook only runs under `/storybook` on Netlify. Links like
 * `/?path=/docs/welcome--docs` load the Next home page and ignore `path`.
 * Redirect so bookmarks / mistaken URLs still reach Storybook.
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  if (url.pathname !== "/") {
    return NextResponse.next();
  }

  let path = url.searchParams.get("path");
  if (!path) {
    return NextResponse.next();
  }

  // Mistyped paste: ...?path=/docs/welcome--docs/storybook
  if (path.endsWith("/storybook")) {
    path = path.replace(/\/storybook$/, "");
    url.searchParams.set("path", path);
  }

  const looksLikeStorybook =
    path.startsWith("/docs/") || path.startsWith("/story/");

  if (!looksLikeStorybook) {
    return NextResponse.next();
  }

  url.pathname = "/storybook";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/",
};
