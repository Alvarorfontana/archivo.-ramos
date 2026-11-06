import { NextRequest, NextResponse } from 'next/server';
export function authorize(request: NextRequest) {
 const expected = process.env.ARCHIVE_ACCESS_PASSWORD;
 if (!expected) return NextResponse.json({ error: 'El acceso aún no está configurado. Definí ARCHIVE_ACCESS_PASSWORD en Vercel.' }, { status: 503 });
 const supplied = request.headers.get('x-archive-password') || '';
 if (supplied.length !== expected.length || supplied !== expected) return NextResponse.json({ error: 'Acceso no autorizado.' }, { status: 401 });
 return null;
}
