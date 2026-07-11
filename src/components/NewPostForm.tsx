"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useAuth } from "@/lib/auth";

type NewPostFormProps = {
  communityId: string;
};

export default function NewPostForm({ communityId }: NewPostFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function closeModal() {
    if (pending) return;
    setOpen(false);
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, communityId }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error ?? "Something went wrong.");
        return;
      }

      setTitle("");
      setContent("");
      setOpen(false);
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        label="+ New Post"
        onClick={() => setOpen(true)}
        disabled={!user}
      />
      {!user && (
        <p className="text-right text-xs text-gray-500">
          Log in to create a post.
        </p>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Create a new post
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="post-title"
                  className="block text-sm font-medium text-gray-900"
                >
                  Title
                </label>
                <input
                  id="post-title"
                  name="title"
                  type="text"
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="What do you want to share?"
                />
              </div>

              <div>
                <label
                  htmlFor="post-content"
                  className="block text-sm font-medium text-gray-900"
                >
                  Content
                </label>
                <textarea
                  id="post-content"
                  name="content"
                  required
                  rows={5}
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Write your post..."
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  label="Cancel"
                  variant="secondary"
                  onClick={closeModal}
                  disabled={pending}
                />
                <Button
                  label={pending ? "Creating..." : "Create Post"}
                  type="submit"
                  disabled={pending}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
