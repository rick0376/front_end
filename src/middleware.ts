import { NextRequest, NextResponse } from 'next/server';
import { getCookieServer } from '@/lib/cookieServer';
import { api } from '@/services/api';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Permite o acesso a rotas internas e à página inicial
  if (pathname.startsWith('/_next') || pathname === '/') {
    return NextResponse.next();
  }

  const token = getCookieServer(); // Pode ser string | null

  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    const isValid = await validateToken(token); // Erro acontece aqui

    console.log(isValid);

    if (!isValid) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

// 🚀 Função corrigida com a tipagem correta
async function validateToken(token: string | null): Promise<boolean> {
  if (!token) return false; // Se for null, já retorna false

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
