import { NextResponse } from "next/server";
import { db } from "@/db";
import { communities, events } from "@/db/schema";
import { getAuthUserId } from "@/lib/auth-session";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  if (!getAuthUserId(request)) {
    return NextResponse.json(
      { error: "Please log in before creating an event." },
      { status: 401 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { name, description, location, startTime, endTime, communityId } =
    body as Record<string, unknown>;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof description !== "string" ||
    !description.trim() ||
    typeof location !== "string" ||
    !location.trim() ||
    typeof startTime !== "string" ||
    !startTime ||
    typeof endTime !== "string" ||
    !endTime ||
    typeof communityId !== "string" ||
    !communityId
  ) {
    return NextResponse.json(
      {
        error:
          "name, description, location, startTime, endTime, and communityId are required.",
      },
      { status: 400 }
    );
  }

  const parsedStartTime = new Date(startTime);
  const parsedEndTime = new Date(endTime);

  if (
    Number.isNaN(parsedStartTime.getTime()) ||
    Number.isNaN(parsedEndTime.getTime())
  ) {
    return NextResponse.json(
      { error: "Start time and end time must be valid dates." },
      { status: 400 }
    );
  }

  if (parsedEndTime <= parsedStartTime) {
    return NextResponse.json(
      { error: "End time must be after start time." },
      { status: 400 }
    );
  }

  try {
    const community = await db
      .select({ id: communities.id })
      .from(communities)
      .where(eq(communities.id, communityId))
      .then((rows) => rows[0]);

    if (!community) {
      return NextResponse.json(
        { error: "Community not found." },
        { status: 404 }
      );
    }

    const [event] = await db
      .insert(events)
      .values({
        id: crypto.randomUUID(),
        name: name.trim(),
        description: description.trim(),
        location: location.trim(),
        startTime: parsedStartTime,
        endTime: parsedEndTime,
        communityId,
      })
      .returning();

    return NextResponse.json(event, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create event." },
      { status: 500 }
    );
  }
}
