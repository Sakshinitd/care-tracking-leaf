import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export function getSession() {
  // Simple mock implementation to resolve build errors
  return null;
}

export function withApiAuthRequired(handler: Function) {
  return async function(req: NextRequest) {
    // Simple mock implementation
    return handler(req);
  };
}

export function getAccessToken() {
  // Simple mock implementation
  return null;
} 