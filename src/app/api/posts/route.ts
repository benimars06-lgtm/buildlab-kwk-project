import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";

export async function POST(request: Request) {
  const { title, content, communityId, authorId } = await request.json();

  if (!title || !content || !communityId || !authorId) {
    return NextResponse.json(
      { error: "title, content, communityId, and authorId are required." },
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
