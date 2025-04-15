import { chamiloDb } from '../../lib/chamiloDb';
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { user_id, lesson_id, message, sender } = await req.json();

    await chamiloDb.query(
      "INSERT INTO user_chat_history (user_id, lesson_id, message, sender) VALUES (?, ?, ?, ?)",
      [user_id, lesson_id, message, sender]
    );

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error al guardar el chat:", error);
    return new Response(JSON.stringify({ ok: false, error: String(error) }), {
      status: 500,
    });
  }
}
