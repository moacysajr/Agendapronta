import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const number = url.searchParams.get('number');
    const text = url.searchParams.get('text');
    const EVOLUTIONTOKEN=process.env.EVOLUTIONTOKEN;
    if (!number || !text) {
      return NextResponse.json({ message: 'Missing required parameters' }, { status: 400 });
    }
    console.log("entrou na rota")
    const response = await fetch('https://evolution-api-m5hx.onrender.com/message/sendText/barber', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTIONTOKEN!
      },
      body: JSON.stringify({
        number: `+55${number}`,
        textMessage: {
          text: text
        }
      })
    });
   
    if (!response.ok) {
      throw new Error('Falha ao enviar menssagem ');
    }

    return NextResponse.json({ message: 'menssagem enviada' }, { status: 200 });
  } catch (error) {
    console.error('erro ao mandar menssagem', error);
    return NextResponse.json({ message: 'erro ao mandar menssagem' }, { status: 500 });
  }
}