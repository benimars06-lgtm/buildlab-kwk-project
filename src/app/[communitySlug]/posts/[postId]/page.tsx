import { db } from "@/db";
import { posts, users, communities } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { PostPageProps } from "@/types";

// ============================================================
// POST DETAIL PAGE
// ============================================================
// This page displays a single post and its comments.
//
// YOUR TICKETS WILL ADD:
// - Ticket #7 (Person A): Display comments and add a comment form
// ============================================================

export default async function PostDetailPage({ params }: PostPageProps) {
  const { communitySlug, postId } = await params;

  // First, verify the community exists
  const community = await db
    .select()
    .from(communities)
    .where(eq(communities.slug, communitySlug))
    .then((rows) => rows[0]);

  if (!community) {
    notFound();
  }

  // Then fetch the post, ensuring it belongs to this community
  const post = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      createdAt: posts.createdAt,
      authorName: users.name,
      authorImage: users.image,
    })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .where(and(eq(posts.id, postId), eq(posts.communityId, community.id)))
    .then((rows) => rows[0]);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <Link
        href={`/${communitySlug}`}
        className="mb-4 inline-block text-sm text-blue-600 hover:underline"
      >
        ← Back to community
      </Link>

      <article className="rounded-lg border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
        <div className="mt-2 flex items-center gap-2">
          {post.authorImage && (
            <img
              src={post.authorImage}
              alt={post.authorName ?? "Author"}
              className="h-6 w-6 rounded-full"
            />
          )}
          <span className="text-sm text-gray-500">
            {post.authorName} ·{" "}
            {post.createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        <p className="mt-4 whitespace-pre-wrap text-gray-700">{post.content}</p>
      </article>

      {/* ====================================================== */}
      {/* PLACEHOLDER: Comments will go here.                    */}
      {/* See Ticket #7 (Person A).                              */}
      {/* ====================================================== */}
      <div className="mt-6 rounded-lg border-2 border-dashed border-gray-300 bg-white p-8 text-center">
        <p className="text-lg font-medium text-gray-400">
          💬 Comments will appear here
        </p>
        <p className="mt-2 text-sm text-gray-400">
          See Ticket #7 to build this!
        </p>
      </div>
    </div>
  );
}
