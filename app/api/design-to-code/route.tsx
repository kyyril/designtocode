import { db } from "@/configs/db";
import { DesignToCodeTable } from "@/configs/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt, model, imageUrl, uid, email } = await req.json();
  const result = await db
    .insert(DesignToCodeTable)
    .values({
      uid: uid,
      createdBy: email,
      imageUrl: imageUrl,
      model: model,
      prompt: prompt,
    })
    .returning({ id: DesignToCodeTable.id });
  return NextResponse.json(result);
}
