import { db } from "@/db";
import { communities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import CommunityNav from "@/components/CommunityNav";
import type { CommunityPageProps } from "@/types";

// ============================================================
// COMMUNITY HOMEPAGE
// ============================================================
// This is the main page for a specific community.
// Right now it just shows the community name and description.
//
// YOUR TICKETS WILL ADD:
// - Ticket #1 (Person A): Display a list of posts here
// - Ticket #3 (Person C): Display a list of resources here
// - Ticket #4 (Person A): Add a "New Post" button and form
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{community.name}</h1>
        <p className="mt-2 text-gray-600">{community.description}</p>
      </div>

      <CommunityNav slug={community.slug} activeTab="home" />

      {/* ====================================================== */}
      {/* PLACEHOLDER: Posts and Resources will go here.          */}
      {/* See Tickets #1, #3, #4, #6, and #10.                   */}
      {/* ====================================================== */}
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
        <p className="text-lg font-medium text-gray-400">
          📝 Posts and Resources will appear here
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Check your tickets to get started!
        </p>
      </div>
    </div>
  );
}
