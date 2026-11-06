import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';
if (!process.env.DATABASE_URL) throw new Error('Falta DATABASE_URL. Configurá Neon antes de migrar.');
const sql = neon(process.env.DATABASE_URL);
const migration = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');
// Schema is split only at statement boundaries; schema contains no procedural blocks.
for (const statement of migration.split(';').map(s => s.trim()).filter(Boolean)) await sql.query(statement);
console.log('Migración ARCHIVO 1989 aplicada.');
