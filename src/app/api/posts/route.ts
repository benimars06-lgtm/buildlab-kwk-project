import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { getAuthUserId } from "@/lib/auth-session";

export async function POST(request: Request) {
  const authorId = getAuthUserId(request);

  if (!authorId) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const { title, content, communityId } = await request.json();

  if (!title || !content || !communityId) {
    return NextResponse.json(
      { error: "title, content, and communityId are required." },
      { status: 400 },
    );
  }

  try {
    const [post] = await db
      .insert(posts)
      .values({
        id: crypto.randomUUID(),
        title,
        content,
        communityId,
        authorId,
      })
      .returning();

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create post." },
      { status: 500 },
    );
  }
}
