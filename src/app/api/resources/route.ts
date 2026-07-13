import { NextResponse } from "next/server";
import { db } from "@/db";
import { resources } from "@/db/schema";

export async function POST(request: Request) {
  let body: {
    title?: unknown;
    description?: unknown;
    url?: unknown;
    communityId?: unknown;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const url = typeof body.url === "string" ? body.url.trim() : "";
  const communityId =
    typeof body.communityId === "string" ? body.communityId.trim() : "";

  if (!title || !description || !url || !communityId) {
    return NextResponse.json(
      { error: "title, description, url, and communityId are required." },
      { status: 400 },
    );
  }

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return NextResponse.json(
        { error: "URL must start with http:// or https://." },
        { status: 400 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "URL must be a valid URL." },
      { status: 400 },
    );
  }

  try {
    const [resource] = await db
      .insert(resources)
      .values({
        id: crypto.randomUUID(),
        title,
        description,
        url,
        communityId,
      })
      .returning();

    return NextResponse.json(resource, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not create resource." },
      { status: 500 },
    );
  }
}
