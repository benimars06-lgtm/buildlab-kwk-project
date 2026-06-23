import Link from "next/link";

type CommunityNavProps = {
  slug: string;
  activeTab: "home" | "events";
};

export default function CommunityNav({ slug, activeTab }: CommunityNavProps) {
  return (
    <nav className="mb-8 flex gap-4 border-b border-gray-200 pb-4">
      <Link
        href={`/${slug}`}
        className={`text-sm font-medium ${
          activeTab === "home"
            ? "text-blue-600"
            : "text-gray-500 hover:text-gray-900"
        }`}
      >
        Home
      </Link>
      <Link
        href={`/${slug}/events`}
        className={`text-sm font-medium ${
          activeTab === "events"
            ? "text-blue-600"
            : "text-gray-500 hover:text-gray-900"
        }`}
      >
        Events
      </Link>
    </nav>
  );
}
