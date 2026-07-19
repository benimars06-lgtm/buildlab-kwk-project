import { db } from "@/db";
import { communities, events, eventsRSVP, users } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import CommunityNav from "@/components/CommunityNav";
import NewEventForm from "@/components/NewEventForm";
import RSVPPanel, { type EventAttendee } from "@/components/RSVPPanel";
import { DEV_AUTH_COOKIE_NAME } from "@/lib/auth-session";
import type { CommunityPageProps } from "@/types";

// ============================================================
// EVENTS PAGE
// ============================================================
// This page will display all events for a community.
//
// YOUR TICKETS WILL ADD:
// ✅ Ticket #2 (Person B): Fetch and display the list of events/
// ✅ Ticket #5 (Person B): Add a "New Event" button and form
// ✅ Ticket #9 (Person B): Add RSVP functionality to each event
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

  const communityEvents = await db
    .select({
      id: events.id,
      name: events.name,
      description: events.description,
      location: events.location,
      startTime: events.startTime,
      endTime: events.endTime,
    })
    .from(events)
    .where(eq(events.communityId, community.id))
    .orderBy(asc(events.startTime));

  const cookieUserId = (await cookies()).get(DEV_AUTH_COOKIE_NAME)?.value;
  const attendingEventIds = new Set<string>();
  const attendeesByEventId = new Map<string, EventAttendee[]>();

  if (cookieUserId) {
    const currentUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, cookieUserId))
      .then((rows) => rows[0]);

    // If a dev-auth cookie exists, look up the corresponding user and fetch their RSVPs.
    // For each RSVP row, add the eventId to attendingEventIds so the UI can mark which events the user is attending.
    if (currentUser) {
      const currentUserRSVPs = await db
        .select({ eventId: eventsRSVP.eventId })
        .from(eventsRSVP)
        .where(eq(eventsRSVP.userId, currentUser.id));

      // (used as RSVPButton's initialAttending).
      for (const rsvp of currentUserRSVPs) {
        attendingEventIds.add(rsvp.eventId);
      }

      const communityEventAttendees = await db
        .select({
          eventId: eventsRSVP.eventId,
          id: users.id,
          name: users.name,
          image: users.image,
        })
        .from(eventsRSVP)
        .innerJoin(users, eq(eventsRSVP.userId, users.id))
        .innerJoin(events, eq(eventsRSVP.eventId, events.id))
        .where(eq(events.communityId, community.id))
        .orderBy(asc(users.name), asc(users.id));

      for (const attendee of communityEventAttendees) {
        const eventAttendees = attendeesByEventId.get(attendee.eventId) ?? [];

        eventAttendees.push({
          id: attendee.id,
          name: attendee.name,
          image: attendee.image,
        });
        attendeesByEventId.set(attendee.eventId, eventAttendees);
      }
    }
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

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Events</h2>

        <div className="mb-6">
          <NewEventForm communityId={community.id} />
        </div>

        {communityEvents.length > 0 ? (
          <div className="space-y-4">
            {communityEvents.map((event) => {
              const eventAttendees = attendeesByEventId.get(event.id) ?? [];
              const isAttending = attendingEventIds.has(event.id);

              return (
                <article
                  key={event.id}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {event.name}
                  </h3>
                  <p className="mt-2 text-gray-700">{event.description}</p>
                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium text-gray-900">
                        Location:
                      </span>{" "}
                      {event.location}
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">
                        Starts:
                      </span>{" "}
                      <time dateTime={event.startTime.toISOString()}>
                        {event.startTime.toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </time>
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">Ends:</span>{" "}
                      <time dateTime={event.endTime.toISOString()}>
                        {event.endTime.toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </time>
                    </p>
                  </div>

                  <RSVPPanel
                    eventId={event.id}
                    initialAttending={isAttending}
                    initialAttendees={eventAttendees}
                  />
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-lg font-medium text-gray-400">No events yet</p>
            <p className="mt-2 text-sm text-gray-400">
              Events for this community will appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
