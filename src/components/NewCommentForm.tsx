"use client";

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
    </form>
  );
}
