import { NextResponse } from "next/server";
import { db } from "@/db";
import { events, eventsRSVP, users } from "@/db/schema";
import { getAuthUserId } from "@/lib/auth-session";
import { eq } from "drizzle-orm";

type RSVPRouteContext = {
  params: Promise<{ eventId: string }>;
};

export async function POST(request: Request, { params }: RSVPRouteContext) {
  let userId: string | null;

  try {
    userId = getAuthUserId(request);
  } catch {
    return NextResponse.json(
      { error: "Invalid user session." },
      { status: 401 }
    );
  }

  if (!userId) {
    return NextResponse.json(
      { error: "Please log in before RSVPing." },
      { status: 401 }
    );
  }

  const { eventId } = await params;

  if (!eventId.trim()) {
    return NextResponse.json(
      { error: "A valid event ID is required." },
      { status: 400 }
    );
  }

  try {
    const [userRows, eventRows] = await Promise.all([
      db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1),
      db
        .select({ id: events.id })
        .from(events)
        .where(eq(events.id, eventId))
        .limit(1),
    ]);

    if (!userRows[0]) {
      return NextResponse.json(
        { error: "Invalid user session." },
        { status: 401 }
      );
    }

    if (!eventRows[0]) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    const [rsvp] = await db
      .insert(eventsRSVP)
      .values({ eventId, userId })
      .onConflictDoNothing()
      .returning({
        eventId: eventsRSVP.eventId,
        userId: eventsRSVP.userId,
      });

    if (!rsvp) {
      return NextResponse.json(
        { error: "You have already RSVP’d for this event." },
        { status: 409 }
      );
    }

    return NextResponse.json(rsvp, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to RSVP for this event." },
      { status: 500 }
    );
  }
}
