import { config } from "dotenv";
// Load .env.local before anything else (Next.js loads this automatically,
// but tsx doesn't, so we need to do it manually for the seed script)
config({ path: ".env.local" });

import { db } from "./index";
import * as schema from "./schema";
import { sql } from "drizzle-orm";

// ============================================================
// SEED SCRIPT — Community Hub
// ============================================================
// Run this with: pnpm run seed
// It fills the database with sample data so you have something
// to work with from day one.
//
// Before running this, make sure you've run: pnpm run db:push
// ============================================================

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data (in reverse order of dependencies)
  await db.execute(sql`DELETE FROM comments`);
  await db.execute(sql`DELETE FROM resources`);
  await db.execute(sql`DELETE FROM events`);
  await db.execute(sql`DELETE FROM posts`);
  await db.execute(sql`DELETE FROM communities`);
  await db.execute(sql`DELETE FROM users`);

  // --- Users ---
  const users = [
    {
      id: "user-1",
      name: "Alex Rivera",
      email: "alex@example.com",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
    {
      id: "user-2",
      name: "Jordan Chen",
      email: "jordan@example.com",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
    },
    {
      id: "user-3",
      name: "Sam Okafor",
      email: "sam@example.com",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
    },
    {
      id: "user-4",
      name: "Maya Patel",
      email: "maya@example.com",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
    },
  ];

  await db.insert(schema.users).values(users);
  console.log(`  ✅ Created ${users.length} users`);

  // --- Communities ---
  const communities = [
    {
      id: "community-1",
      name: "AI for Artists",
      slug: "ai-for-artists",
      description:
        "A community for artists exploring how AI tools can enhance their creative process. Share projects, discuss ethics, and learn together.",
    },
    {
      id: "community-2",
      name: "Indie Game Developers",
      slug: "indie-game-devs",
      description:
        "Connect with fellow indie game developers. Share your work-in-progress, find collaborators, and get feedback on your games.",
    },
    {
      id: "community-3",
      name: "Local Climate Action",
      slug: "climate-action",
      description:
        "Organizing local climate action initiatives. Find volunteer opportunities, share resources, and plan community events.",
    },
  ];

  await db.insert(schema.communities).values(communities);
  console.log(`  ✅ Created ${communities.length} communities`);

  // --- Posts ---
  const posts = [
    {
      id: "post-1",
      title: "Welcome to AI for Artists!",
      content:
        "Hey everyone! So excited to kick off this community. I've been experimenting with Midjourney and Stable Diffusion for my illustration work, and I'd love to hear what tools you all are using. Drop a comment below!",
      communityId: "community-1",
      authorId: "user-1",
      createdAt: new Date("2026-06-15T10:00:00"),
    },
    {
      id: "post-2",
      title: "My first AI-assisted painting",
      content:
        "I used DALL-E to generate a rough composition, then painted over it in Procreate. The result is something I never would have come up with on my own. Here's what I learned about the process...",
      communityId: "community-1",
      authorId: "user-2",
      createdAt: new Date("2026-06-16T14:30:00"),
    },
    {
      id: "post-3",
      title: "Looking for playtesters for my puzzle game",
      content:
        "I've been working on a puzzle platformer for the last 6 months and it's finally ready for outside eyes. It's built in Godot and runs in the browser. Would love 3-4 people to try it out and give honest feedback.",
      communityId: "community-2",
      authorId: "user-3",
      createdAt: new Date("2026-06-15T09:00:00"),
    },
    {
      id: "post-4",
      title: "Best free assets for indie devs",
      content:
        "I've compiled a list of the best free asset packs, sound effects, and music libraries that are actually good quality. All of these are CC0 or MIT licensed, so you can use them in commercial projects.",
      communityId: "community-2",
      authorId: "user-4",
      createdAt: new Date("2026-06-17T11:00:00"),
    },
    {
      id: "post-5",
      title: "Park cleanup this Saturday!",
      content:
        "We're organizing a cleanup at Riverside Park this Saturday from 9am-12pm. Gloves and bags provided. Bring water and sunscreen. All ages welcome!",
      communityId: "community-3",
      authorId: "user-1",
      createdAt: new Date("2026-06-14T08:00:00"),
    },
    {
      id: "post-6",
      title: "City council meeting recap",
      content:
        "Attended the city council meeting last night. The good news: they approved funding for 3 new bike lanes downtown. The less good news: the composting program is delayed until next year. Full notes below.",
      communityId: "community-3",
      authorId: "user-4",
      createdAt: new Date("2026-06-18T20:00:00"),
    },
  ];

  await db.insert(schema.posts).values(posts);
  console.log(`  ✅ Created ${posts.length} posts`);

  // --- Events ---
  const events = [
    {
      id: "event-1",
      name: "AI Art Show & Tell",
      description:
        "Bring your latest AI-assisted artwork and share your process with the group. All skill levels welcome!",
      startTime: new Date("2026-07-10T18:00:00"),
      endTime: new Date("2026-07-10T20:00:00"),
      location: "Zoom — link will be shared in Slack",
      communityId: "community-1",
    },
    {
      id: "event-2",
      name: "Indie Game Dev Meetup",
      description:
        "Monthly meetup for indie game developers. This month's theme: level design. Bring a work-in-progress to share!",
      startTime: new Date("2026-07-15T19:00:00"),
      endTime: new Date("2026-07-15T21:00:00"),
      location: "The Game Loft, 123 Main St",
      communityId: "community-2",
    },
    {
      id: "event-3",
      name: "Community Garden Planting Day",
      description:
        "Help us plant the summer garden! We'll be planting tomatoes, peppers, and herbs. No experience needed.",
      startTime: new Date("2026-07-20T09:00:00"),
      endTime: new Date("2026-07-20T12:00:00"),
      location: "Community Garden, 456 Oak Ave",
      communityId: "community-3",
    },
    {
      id: "event-4",
      name: "Climate Documentary Screening",
      description:
        "We're screening 'The Future We Choose' followed by a group discussion. Popcorn provided!",
      startTime: new Date("2026-07-25T18:30:00"),
      endTime: new Date("2026-07-25T21:00:00"),
      location: "Public Library, Room 204",
      communityId: "community-3",
    },
  ];

  await db.insert(schema.events).values(events);
  console.log(`  ✅ Created ${events.length} events`);

  // --- Resources ---
  const resources = [
    {
      id: "resource-1",
      title: "Midjourney Beginner's Guide",
      url: "https://docs.midjourney.com/docs/quick-start",
      description:
        "The official quick start guide for Midjourney. Great for getting your first images generated.",
      communityId: "community-1",
    },
    {
      id: "resource-2",
      title: "AI Art Ethics Reading List",
      url: "https://example.com/ai-art-ethics",
      description:
        "A curated list of articles and papers about the ethical implications of AI-generated art.",
      communityId: "community-1",
    },
    {
      id: "resource-3",
      title: "Godot Engine Documentation",
      url: "https://docs.godotengine.org",
      description:
        "The official documentation for the Godot game engine. Covers everything from basics to advanced topics.",
      communityId: "community-2",
    },
    {
      id: "resource-4",
      title: "Free Sound Effects Library",
      url: "https://freesound.org",
      description:
        "A massive library of free, Creative Commons-licensed sound effects for your games.",
      communityId: "community-2",
    },
    {
      id: "resource-5",
      title: "How to Start a Community Garden",
      url: "https://example.com/community-garden-guide",
      description:
        "Step-by-step guide to starting a community garden in your neighborhood.",
      communityId: "community-3",
    },
    {
      id: "resource-6",
      title: "Local Recycling Guide",
      url: "https://example.com/recycling",
      description:
        "What goes in which bin? A clear guide to recycling in our city.",
      communityId: "community-3",
    },
  ];

  await db.insert(schema.resources).values(resources);
  console.log(`  ✅ Created ${resources.length} resources`);

  // --- Comments ---
  const commentsData = [
    {
      id: "comment-1",
      text: "Welcome! I've been using Stable Diffusion with ControlNet — it's amazing for keeping compositions consistent.",
      postId: "post-1",
      authorId: "user-3",
      createdAt: new Date("2026-06-15T11:30:00"),
    },
    {
      id: "comment-2",
      text: "This is so cool! I love how you combined AI generation with traditional painting. The textures are beautiful.",
      postId: "post-2",
      authorId: "user-1",
      createdAt: new Date("2026-06-16T16:00:00"),
    },
    {
      id: "comment-3",
      text: "I'd love to playtest! DM me the link.",
      postId: "post-3",
      authorId: "user-2",
      createdAt: new Date("2026-06-15T10:00:00"),
    },
    {
      id: "comment-4",
      text: "Count me in for Saturday! Should I bring any tools?",
      postId: "post-5",
      authorId: "user-2",
      createdAt: new Date("2026-06-14T09:30:00"),
    },
  ];

  await db.insert(schema.comments).values(commentsData);
  console.log(`  ✅ Created ${commentsData.length} comments`);

  console.log("\n🎉 Database seeded successfully!");
  console.log("   Run 'pnpm run dev' to start the app.\n");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
