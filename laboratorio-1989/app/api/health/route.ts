import { NextRequest, NextResponse } from 'next/server';
import { authorize } from '@/lib/auth';
import { db } from '@/lib/db';
export const runtime = 'nodejs';
export async function GET(request: NextRequest) { const denied=authorize(request); if(denied)return denied; let database=false; try { await db()`SELECT 1`; database=true; } catch {} return NextResponse.json({ ok: database, checks:{ database, gemini:!!process.env.GEMINI_API_KEY, nara:!!process.env.NARA_API_KEY, accessConfigured:!!process.env.ARCHIVE_ACCESS_PASSWORD }, timestamp:new Date().toISOString() }); }
