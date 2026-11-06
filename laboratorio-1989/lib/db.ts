import { neon } from '@neondatabase/serverless';
let client: any = null;
export function db(): any {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL no está configurada.');
  client ??= neon(process.env.DATABASE_URL);
  return client;
}
