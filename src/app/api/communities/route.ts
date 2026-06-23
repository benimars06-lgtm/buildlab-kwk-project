import { NextResponse } from "next/server";
import { db } from "@/db";
import { communities } from "@/db/schema";

export async function POST(request: Request) {
  const { name, slug, description } = await request.json();

  if (!name || !slug || !description) {
    return NextResponse.json(
      { error: "name, slug, and description are required." },
      { status: 400 },
    );
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { error: "Slug may only contain lowercase letters, numbers, and hyphens." },
      { status: 400 },
    );
  }

  try {
    const [community] = await db
      .insert(communities)
      .values({ id: crypto.randomUUID(), name, slug, description })
      .returning();

    return NextResponse.json(community, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "A community with that slug already exists." },
      { status: 409 },
    );
  }
}
