import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { comments, posts } from "@/db/schema";
import { getAuthUserId, getSeedUserById } from "@/lib/auth-session";

type CommentsRouteContext = {
  params: Promise<{ postId: string }>;
};

export async function POST(request: Request, { params }: CommentsRouteContext) {
  const authorId = getAuthUserId(request);

  if (!authorId || !getSeedUserById(authorId)) {
    return NextResponse.json(
      { error: "You must be logged in to create a comment." },
      { status: 401 }
    );
  }

  let body: { text?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";

  if (!text) {
    return NextResponse.json(
      { error: "Comment text is required." },
      { status: 400 }
    );
  }

  const { postId } = await params;
  const post = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.id, postId))
    .then((rows) => rows[0]);

  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  try {
    const [comment] = await db
      .insert(comments)
      .values({
        id: crypto.randomUUID(),
        text,
        postId: post.id,
        authorId,
      })
      .returning();

    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not create comment." },
      { status: 500 }
    );
  }
}
