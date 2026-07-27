"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";

type UserPost = {
  id: string;
  title: string;
  communityName: string;
  communitySlug: string;
};

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, router, user]);

  useEffect(() => {
    if (isLoading || !user) return;

    const controller = new AbortController();

    async function loadUserPosts() {
      try {
        const response = await fetch("/api/posts", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load your posts.");
        }

        const posts = (await response.json()) as UserPost[];
        setUserPosts(posts);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setPostsError("Unable to load your posts. Please try again later.");
      } finally {
        if (!controller.signal.aborted) {
          setPostsLoading(false);
        }
      }
    }

    void loadUserPosts();

    return () => controller.abort();
  }, [isLoading, user]);

  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Your Profile</h1>

      <div className="flex flex-col items-center gap-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:p-8">
        <img
          src={user.image}
          alt={`${user.name}'s profile picture`}
          className="h-28 w-28 shrink-0 rounded-full border border-gray-200 object-cover"
        />

        <dl className="w-full space-y-5 text-center sm:text-left">
          <div>
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-xl font-semibold text-gray-900">
              {user.name}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 break-all text-gray-700">{user.email}</dd>
          </div>
        </dl>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Your Posts</h2>

        {postsLoading ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
            <p className="text-sm text-gray-500">Loading your posts...</p>
          </div>
        ) : postsError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-700">{postsError}</p>
          </div>
        ) : userPosts.length > 0 ? (
          <div className="space-y-4">
            {userPosts.map((post) => (
              <Link
                key={post.id}
                href={`/${post.communitySlug}/posts/${post.id}`}
                className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Community: {post.communityName}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-8 text-center">
            <p className="text-lg font-medium text-gray-400">No posts yet</p>
            <p className="mt-2 text-sm text-gray-400">
              Posts you author will appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
