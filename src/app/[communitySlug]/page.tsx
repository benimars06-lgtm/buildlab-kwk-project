import { db } from "@/db";
import { communities, posts, resources, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import CommunityNav from "@/components/CommunityNav";
import NewResourceForm from "@/components/NewResourceForm";
import ResourceList from "@/components/ResourceList";
import type { CommunityPageProps } from "@/types";

// ============================================================
// COMMUNITY HOMEPAGE
// ============================================================
// This is the main page for a specific community.
//
// YOUR TICKETS WILL ADD:
// - Ticket #1 (Person A): Display a list of posts here ✅
// - Ticket #3 (Person C): Display a list of resources here ✅
// - Ticket #4 (Person A): Add a "New Post" button and form ✅
// - Ticket #6 (Person C): Add an "Add Resource" button and form
// - Ticket #10 (Person B): Improve the layout and styling
// ============================================================

export default async function CommunityPage({ params }: CommunityPageProps) {
  const { communitySlug } = await params;

  const community = await db
    .select()
    .from(communities)
    .where(eq(communities.slug, communitySlug))
    .then((rows) => rows[0]);

  if (!community) {
    notFound();
  }

  const communityPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      createdAt: posts.createdAt,
      authorName: users.name,
    })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.communityId, community.id))
    .orderBy(desc(posts.createdAt));

  const communityResources = await db
    .select()
    .from(resources)
    .where(eq(resources.communityId, community.id));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{community.name}</h1>
        <p className="mt-2 text-gray-600">{community.description}</p>
      </div>

      <CommunityNav slug={community.slug} activeTab="home" />

      {/* ====================================================== */}
      {/* See Tickets #6, and #10.                       */}
      {/* ====================================================== */}
      <section>
        {communityPosts.length > 0 ? (
          <div className="space-y-4">
            {communityPosts.map((post) => (
              <Link
                key={post.id}
                href={`/${community.slug}/posts/${post.id}`}
                className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  By {post.authorName} ·{" "}
                  {post.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-lg font-medium text-gray-400">No posts yet</p>
            <p className="mt-2 text-sm text-gray-400">
              Posts for this community will appear here.
            </p>
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Resources</h2>
          <NewResourceForm communityId={community.id} />
        </div>

        <ResourceList resources={communityResources} />
      </section>
    </div>
  );
}
