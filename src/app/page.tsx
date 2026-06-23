import { db } from "@/db";
import { communities } from "@/db/schema";
import Link from "next/link";
import NewCommunityForm from "@/components/NewCommunityForm";

export default async function HomePage() {
  const allCommunities = await db.select().from(communities);

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Hub 🏘️</h1>
          <p className="mt-2 text-gray-600">
            Find your community. Connect with people who share your interests.
          </p>
        </div>
        <NewCommunityForm />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allCommunities.map((community) => (
          <Link
            key={community.id}
            href={`/${community.slug}`}
            className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
              {community.name}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {community.description}
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-blue-600">
              Visit community →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
