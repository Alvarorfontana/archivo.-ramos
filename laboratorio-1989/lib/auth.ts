import { NextRequest } from 'next/server';
/** El portal 1989 / ARCHIVE es de acceso público. No exige contraseña de ingreso. */
export function authorize(_request: NextRequest) { return null; }
