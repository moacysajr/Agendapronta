import { NextResponse } from 'next/server';
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function POST(request: Request) {
  const { imageUrl } = await request.json();

  if (!imageUrl) {
    return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
  }

  try {
    // Extrair o fileKey da URL
    const fileKey = imageUrl.split('/').pop();

    // Deletar o arquivo
    await utapi.deleteFiles(fileKey);

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}