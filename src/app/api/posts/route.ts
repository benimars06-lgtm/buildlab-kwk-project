import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { communities, posts } from "@/db/schema";
import { getAuthUserId, getSeedUserById } from "@/lib/auth-session";

export async function GET(request: Request) {
  const authorId = getAuthUserId(request);

  if (!authorId || !getSeedUserById(authorId)) {
    return NextResponse.json(
      { error: "You must be logged in to view your posts." },
      { status: 401 }
    );
  }

  const userPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      communityName: communities.name,
      communitySlug: communities.slug,
    })
    .from(posts)
    .innerJoin(communities, eq(posts.communityId, communities.id))
    .where(eq(posts.authorId, authorId))
    .orderBy(desc(posts.createdAt));

  return NextResponse.json(userPosts);
}

export async function POST(request: Request) {
  const authorId = getAuthUserId(request);

  if (!authorId || !getSeedUserById(authorId)) {
    return NextResponse.json(
      { error: "You must be logged in to create a post." },
      { status: 401 }
    );
  }

  const { title, content, communityId } = await request.json();
  const trimmedTitle = typeof title === "string" ? title.trim() : "";
  const trimmedContent = typeof content === "string" ? content.trim() : "";
  const trimmedCommunityId =
    typeof communityId === "string" ? communityId.trim() : "";

  if (!trimmedTitle || !trimmedContent || !trimmedCommunityId) {
    return NextResponse.json(
      { error: "title, content, and communityId are required." },
      { status: 400 }
    );
  }

  const community = await db
    .select({ id: communities.id })
    .from(communities)
    .where(eq(communities.id, trimmedCommunityId))
    .then((rows) => rows[0]);

  if (!community) {
    return NextResponse.json(
      { error: "Community not found." },
      { status: 404 }
    );
  }

  const [post] = await db
    .insert(posts)
    .values({
      id: crypto.randomUUID(),
      title: trimmedTitle,
      content: trimmedContent,
      communityId: trimmedCommunityId,
      authorId,
    })
    .returning();

  return NextResponse.json(post, { status: 201 });
}
