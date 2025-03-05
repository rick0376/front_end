import { NextRequest, NextResponse } from 'next/server';
import { getCookieServer } from '@/lib/cookieServer';
import { api } from '@/services/api';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Permite o acesso a rotas internas e à página inicial
  if (pathname.startsWith('/_next') || pathname === '/') {
    return NextResponse.next();
  }

  // ⚠️ Aqui estava o problema! Agora usamos `await` para obter o valor correto.
  const token = await getCookieServer(); 

  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    const isValid = await validateToken(token);

    console.log(isValid);

    if (!isValid) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

// ✅ Agora esta função aceita `string | null` e sempre retorna um boolean
async function validateToken(token: string | null): Promise<boolean> {
  if (!token) return false; // Se for null, já retorna false.

  try {
    await api.get('/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return true;
  } catch (err) {
    return false;
  }
}

