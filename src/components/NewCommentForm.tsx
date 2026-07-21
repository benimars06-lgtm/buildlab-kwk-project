"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useAuth } from "@/lib/auth";

type NewCommentFormProps = {
  postId: string;
};

type GifResult = {
  id: string;
  title: string;
  previewUrl: string;
  url: string;
};

const gifResults: GifResult[] = [];

export default function NewCommentForm({ postId }: NewCommentFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [gifModalOpen, setGifModalOpen] = useState(false);
  const [gifSearch, setGifSearch] = useState("");
  const closeGifButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!gifModalOpen) return;

    closeGifButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setGifModalOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gifModalOpen]);

  function closeGifModal() {
    setGifModalOpen(false);
    setGifSearch("");
  }

  function handleGifSelect(gif: GifResult) {
    setText((currentText) =>
      currentText.trimEnd() ? `${currentText.trimEnd()}\n${gif.url}` : gif.url
    );
    closeGifModal();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending || !user) return;

    const trimmedText = text.trim();
    if (!trimmedText) {
      setError("Comment text is required.");
      return;
    }

    setError(null);
    setPending(true);

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmedText }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error ?? "Something went wrong.");
        return;
      }

      setText("");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 rounded-lg border border-gray-200 bg-white p-4"
    >
      <label
        htmlFor="comment-text"
        className="block text-sm font-medium text-gray-900"
      >
        Add a comment
      </label>
      <textarea
        id="comment-text"
        name="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        required
        rows={2}
        disabled={!user || pending}
        placeholder={user ? "Write your comment..." : "Log in to comment."}
        className="mt-2 w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
      />

      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-4">
        {!user ? (
          <p className="text-xs text-gray-500">Log in to add a comment.</p>
        ) : (
          <Button
            label="Add a GIF"
            variant="secondary"
            onClick={() => setGifModalOpen(true)}
            disabled={pending}
          />
        )}
        <Button
          label={pending ? "Adding..." : "Add Comment"}
          type="submit"
          disabled={!user || pending || !text.trim()}
        />
      </div>

      {gifModalOpen && user && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeGifModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="gif-picker-title"
            aria-describedby="gif-picker-description"
            className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="gif-picker-title"
                  className="text-xl font-semibold text-gray-900"
                >
                  Add a GIF
                </h2>
                <p
                  id="gif-picker-description"
                  className="mt-1 text-sm text-gray-600"
                >
                  Search will be available after the GIF service is connected.
                </p>
              </div>
              <button
                ref={closeGifButtonRef}
                type="button"
                onClick={closeGifModal}
                aria-label="Close GIF picker"
                className="rounded-md px-2 py-1 text-xl leading-none text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                &times;
              </button>
            </div>

            <div className="mt-5 flex gap-2">
              <label htmlFor="gif-search" className="sr-only">
                Search for a GIF
              </label>
              <input
                id="gif-search"
                type="search"
                value={gifSearch}
                onChange={(event) => setGifSearch(event.target.value)}
                placeholder="Search for a GIF"
                disabled
                className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
              />
              <Button label="Search" disabled />
            </div>

            <div className="mt-5 max-h-80 overflow-y-auto" aria-live="polite">
              {gifResults.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {gifResults.map((gif) => (
                    <button
                      key={gif.id}
                      type="button"
                      onClick={() => handleGifSelect(gif)}
                      className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <img
                        src={gif.previewUrl}
                        alt={gif.title || "GIF search result"}
                        className="aspect-square h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
                  <p className="text-sm font-medium text-gray-700">
                    GIF search is not connected yet.
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Results will appear here once the data source is added.
                  </p>
                </div>
              )}
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Powered by GIPHY
            </p>
          </section>
        </div>
      )}
    </form>
  );
}
