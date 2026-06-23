import { db } from "@/db";
import { communities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import CommunityNav from "@/components/CommunityNav";
import type { CommunityPageProps } from "@/types";

// ============================================================
// EVENTS PAGE
// ============================================================
// This page will display all events for a community.
//
// YOUR TICKETS WILL ADD:
// - Ticket #2 (Person B): Fetch and display the list of events
// - Ticket #5 (Person B): Add a "New Event" button and form
// - Ticket #9 (Person B): Add RSVP functionality to each event
// ============================================================

export default async function EventsPage({ params }: CommunityPageProps) {
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
        <h1 className="text-3xl font-bold text-gray-900">
          {community.name} — Events
        </h1>
        <p className="mt-2 text-gray-600">
          Upcoming events for {community.name}.
        </p>
      </div>

      <CommunityNav slug={community.slug} activeTab="events" />

      {/* ====================================================== */}
      {/* PLACEHOLDER: Events list will go here.                 */}
      {/* See Tickets #2, #5, and #9.                            */}
      {/* ====================================================== */}
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
        <p className="text-lg font-medium text-gray-400">
          📅 Events will appear here
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Check your tickets to get started!
        </p>
      </div>
    </div>
  );
}
