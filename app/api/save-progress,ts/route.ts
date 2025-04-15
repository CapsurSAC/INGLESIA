import { NextRequest } from "next/server";
import { chamiloDb } from '../../lib/chamiloDb';

export async function POST(req: NextRequest) {
  const { user_id, lesson_id, step_number, completed } = await req.json();
  const body = await req.json();
  console.log("📩 Datos recibidos para guardar progreso:", body); 
  console.log("✅ Se recibió POST en save-progress");
  console.log("🔢 Datos recibidos:", user_id, lesson_id, step_number, completed);

  
  try {
    await chamiloDb.execute(
      `INSERT INTO lesson_progress (user_id, lesson_id, step_number, completed)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         step_number = VALUES(step_number),
         completed = VALUES(completed)`
      ,
      [user_id, lesson_id, step_number, completed]
    );

    return new Response(JSON.stringify({ ok: true }));
  } catch (error) {
    console.error("Error saving progress:", error);
    return new Response(JSON.stringify({ ok: false, error }), { status: 500 });
  }
}
