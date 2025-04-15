// app/api/test-db/route.ts
import { chamiloDb } from '../../lib/chamiloDb';




export async function GET() {
  try {
    const [rows] = await chamiloDb.query('SELECT 1 + 1 AS result');
    return new Response(JSON.stringify({ ok: true, result: rows }), {
      status: 200,
    });
  } catch (error: any) {
    console.error('Error de conexión:', error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
    });
  }
}
