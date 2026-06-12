import { NextRequest, NextResponse } from 'next/server';

// Auth is handled client-side in (main)/layout.tsx using AuthContext + localStorage.
// This middleware passes all requests through without any auth checks.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
