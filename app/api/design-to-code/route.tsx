import { db } from "@/configs/db";
import { DesignToCodeTable } from "@/configs/schema";
import { eq } from "drizzle-orm";
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

export async function GET(res: NextResponse) {
  const reqUrl = res.url;
  const { searchParams } = new URL(reqUrl);
  const uid = searchParams?.get("uid");
  if (uid) {
    const result = await db
      .select()
      .from(DesignToCodeTable)
      .where(eq(DesignToCodeTable.uid, uid));
    return NextResponse.json(result[0]);
  }
  return NextResponse.json({ error: "No UID provided." });
}
