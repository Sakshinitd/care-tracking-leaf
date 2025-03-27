import { NextRequest, NextResponse } from 'next/server';

export function getSession() {
  // Simple mock implementation to resolve build errors
  return null;
}

type ApiHandler = (req: NextRequest) => Promise<NextResponse>;

export function withApiAuthRequired(handler: ApiHandler) {
  return async function(req: NextRequest) {
    // Simple mock implementation
    return handler(req);
  };
}

export function getAccessToken() {
  // Simple mock implementation
  return null;
} 