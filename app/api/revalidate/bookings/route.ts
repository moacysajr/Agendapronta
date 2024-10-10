// app/api/revalidate/bookings/route.ts
import { revalidatePath } from 'next/cache';

export async function GET() {
  // TODO: ????
  try {
    revalidatePath('/admin/bookings');
    return new Response(JSON.stringify({ revalidated: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ revalidated: false }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
