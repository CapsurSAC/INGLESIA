import { NextRequest } from "next/server";
import { chamiloDb } from '../../lib/chamiloDb';

export async function POST(req: NextRequest) {
  const { user_id, lesson_id } = await req.json();

  try {
    const [rows]: any = await chamiloDb.query(
      `SELECT step_number, completed FROM lesson_progress WHERE user_id = ? AND lesson_id = ?`,
      [user_id, lesson_id]
    );

    if (rows.length > 0) {
      return new Response(JSON.stringify(rows[0]), { status: 200 });
    } else {
      return new Response(JSON.stringify({ step_number: 0, completed: false }), { status: 200 });
    }
  } catch (error) {
    console.error("Error retrieving progress:", error);
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}
