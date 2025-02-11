import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";

export async function POST(req: NextRequest) {
  try {
    const { userEmail, userName } = await req.json();

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userEmail));

    if (existingUser.length === 0) {
      const newUser = await db
        .insert(usersTable)
        .values({
          name: userName,
          email: userEmail,
          credits: 0,
        })
        .returning({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          credits: usersTable.credits,
        });

      return NextResponse.json(newUser[0]);
    }

    return NextResponse.json(existingUser[0]);
  } catch (error) {
    console.error("User API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
