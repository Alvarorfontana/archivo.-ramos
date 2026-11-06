import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
export function authorize(request: NextRequest) {
 const expected = process.env.ARCHIVE_ACCESS_PASSWORD;
 if (!expected) return NextResponse.json({ error: 'El acceso aún no está configurado. Definí ARCHIVE_ACCESS_PASSWORD en Vercel.' }, { status: 503 });
 const supplied = request.headers.get('x-archive-password') || '';
 const left=Buffer.from(supplied); const right=Buffer.from(expected);
 if (left.length !== right.length || !timingSafeEqual(left,right)) return NextResponse.json({ error: 'Acceso no autorizado.' }, { status: 401 });
 return null;
}
