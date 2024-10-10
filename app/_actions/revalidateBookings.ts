import { revalidatePath } from 'next/cache';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path');

  if (path) {
    revalidatePath(path);
    return new Response(JSON.stringify({ revalidated: true, now: Date.now() }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({
    revalidated: false,
    now: Date.now(),
    message: 'Missing path to revalidate',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
