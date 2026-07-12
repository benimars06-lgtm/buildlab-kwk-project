"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useAuth } from "@/lib/auth";

type NewEventFormProps = {
  communityId: string;
};

export default function NewEventForm({ communityId }: NewEventFormProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("Please log in before creating an event.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;

    setPending(true);

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: title,
          description,
          location,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
          communityId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error ?? "Something went wrong.");
        return;
      }

      setOpen(false);
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  function handleCancel() {
    setError(null);
    setOpen(false);
  }

  return (
    <>
      <Button label="+ New Event" onClick={() => setOpen(true)} />

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Create a new event
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="event-title"
                  className="block text-sm font-medium text-gray-900"
                >
                  Title
                </label>
                <input
                  id="event-title"
                  name="title"
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Event title"
                />
              </div>

              <div>
                <label
                  htmlFor="event-description"
                  className="block text-sm font-medium text-gray-900"
                >
                  Description
                </label>
                <textarea
                  id="event-description"
                  name="description"
                  required
                  rows={3}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="What is this event about?"
                />
              </div>

              <div>
                <label
                  htmlFor="event-location"
                  className="block text-sm font-medium text-gray-900"
                >
                  Location
                </label>
                <input
                  id="event-location"
                  name="location"
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Event location"
                />
              </div>

              <div>
                <label
                  htmlFor="event-start-time"
                  className="block text-sm font-medium text-gray-900"
                >
                  Start time
                </label>
                <input
                  id="event-start-time"
                  name="startTime"
                  type="datetime-local"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="event-end-time"
                  className="block text-sm font-medium text-gray-900"
                >
                  End time
                </label>
                <input
                  id="event-end-time"
                  name="endTime"
                  type="datetime-local"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  label="Cancel"
                  variant="secondary"
                  onClick={handleCancel}
                />
                <Button label="Create" type="submit" disabled={pending} />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
