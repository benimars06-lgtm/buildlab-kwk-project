"use client";

<<<<<<< HEAD
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
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
          <span />
        )}
        <Button
          label={pending ? "Adding..." : "Add Comment"}
          type="submit"
          disabled={!user || pending || !text.trim()}
        />
      </div>
=======
import { useState, type FormEvent } from "react";
import Button from "@/components/Button";

type NewCommentFormProps = {
  onSubmit: (text: string) => void;
};

export default function NewCommentForm({ onSubmit }: NewCommentFormProps) {
  const [text, setText] = useState("");
  const trimmedText = text.trim();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!trimmedText) {
      return;
    }

    onSubmit(trimmedText);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="comment-text"
          className="block text-sm font-medium text-gray-900"
        >
          Comment
        </label>
        <textarea
          id="comment-text"
          name="comment"
          required
          rows={3}
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Write a comment"
        />
      </div>

      <div className="flex justify-end">
        <Button label="Submit" type="submit" disabled={!trimmedText} />
      </div>
>>>>>>> 245c4c7 (Lesson 6 Updates: Delete After First PR)
    </form>
  );
}
