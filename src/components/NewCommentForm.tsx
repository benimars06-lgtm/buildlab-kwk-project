"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import GifPicker from "@/components/GifPicker";
import { useAuth } from "@/lib/auth";

type NewCommentFormProps = {
  postId: string;
};

export default function NewCommentForm({ postId }: NewCommentFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [gifModalOpen, setGifModalOpen] = useState(false);
  const [selectedGifUrls, setSelectedGifUrls] = useState<string[]>([]);

  function closeGifModal() {
    setGifModalOpen(false);
  }

  function handleGifSelect(gifUrl: string) {
    setSelectedGifUrls((currentUrls) => [...currentUrls, gifUrl]);
  }

  function removeSelectedGif(indexToRemove: number) {
    setSelectedGifUrls((currentUrls) =>
      currentUrls.filter((_, index) => index !== indexToRemove)
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending || !user) return;

    const commentText = [text.trim(), ...selectedGifUrls]
      .filter(Boolean)
      .join("\n");

    if (!commentText) {
      setError("Comment text or a GIF is required.");
      return;
    }

    setError(null);
    setPending(true);

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error ?? "Something went wrong.");
        return;
      }

      setText("");
      setSelectedGifUrls([]);
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
        rows={2}
        disabled={!user || pending}
        placeholder={user ? "Write your comment..." : "Log in to comment."}
        className="mt-2 w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
      />

      {selectedGifUrls.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-900">Selected GIFs</p>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {selectedGifUrls.map((gifUrl, index) => (
              <div
                key={`${gifUrl}-${index}`}
                className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
              >
                <img
                  src={gifUrl}
                  alt={`Selected GIF ${index + 1}`}
                  className="aspect-square w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeSelectedGif(index)}
                  className="w-full border-t border-gray-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
          disabled={
            !user || pending || (!text.trim() && selectedGifUrls.length === 0)
          }
        />
      </div>

      {user && (
        <GifPicker
          open={gifModalOpen}
          onClose={closeGifModal}
          onSelect={handleGifSelect}
        />
      )}
    </form>
  );
}
