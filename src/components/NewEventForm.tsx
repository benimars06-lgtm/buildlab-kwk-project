"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useAuth } from "@/lib/auth";

export default function NewEventForm() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("Please log in before creating an event.");
      return;
    }

    setOpen(false);
    router.refresh();
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
                <Button label="Create" type="submit" />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
