import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*"],
};

export function middleware(request: NextRequest) {
  const username = process.env.DASHBOARD_ADMIN_USERNAME?.trim();
  const password = process.env.DASHBOARD_ADMIN_PASSWORD?.trim();

  if (!username || !password) {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.next();
    }

    return new NextResponse("Admin dashboard credentials are not configured.", {
      status: 503,
    });
  }

  if (isAuthorized(request.headers.get("authorization"), username, password)) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="PulpSense Client Dashboard"',
    },
  });
}

function isAuthorized(
  authorization: string | null,
  expectedUsername: string,
  expectedPassword: string,
): boolean {
  if (!authorization?.startsWith("Basic ")) {
    return false;
  }

  const encodedCredentials = authorization.slice("Basic ".length).trim();
  const decodedCredentials = decodeBasicCredentials(encodedCredentials);

  if (!decodedCredentials) {
    return false;
  }

  const separatorIndex = decodedCredentials.indexOf(":");

  if (separatorIndex === -1) {
    return false;
  }

  return (
    decodedCredentials.slice(0, separatorIndex) === expectedUsername &&
    decodedCredentials.slice(separatorIndex + 1) === expectedPassword
  );
}

function decodeBasicCredentials(encodedCredentials: string): string | undefined {
  try {
    return atob(encodedCredentials);
  } catch {
    return undefined;
  }
}
