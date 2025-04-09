import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const audioBlob = formData.get("audio") as File;

  if (!audioBlob) {
    return NextResponse.json(
      { error: "No audio file provided" },
      { status: 400 },
    );
  }

  const openaiRes = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: (() => {
        const fd = new FormData();
        fd.set("file", audioBlob);
        fd.set("model", "whisper-1");
        fd.set("response_format", "text");
        return fd;
      })(),
    },
  );

  const transcript = await openaiRes.text();

  return NextResponse.json({ transcript });
}
