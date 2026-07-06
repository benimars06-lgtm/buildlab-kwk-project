"use client";

import { useState } from "react";
import Button from "@/components/Button";

type NewPostFormProps = {
  action?: (formData: FormData) => void | Promise<void>;
};

export default function NewPostForm({ action }: NewPostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <form
      action={action}
      className="space-y-4 rounded-lg border border-gray-200 bg-white p-6"
    >
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-900"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Post title"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-900"
        >
          Content
        </label>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={6}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="What would you like to share?"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button label="Create Post" type="submit" />
      </div>
    </form>
  );
}
