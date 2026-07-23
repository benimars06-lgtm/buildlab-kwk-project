"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useAuth } from "@/lib/auth";

export type EventAttendee = {
  id: string;
  name: string;
  image: string | null;
};

type RSVPPanelProps = {
  eventId: string;
  initialAttending: boolean;
  initialAttendees: EventAttendee[];
};

type RSVPResponse = {
  attendees: EventAttendee[];
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function RSVPPanel({
  eventId,
  initialAttending,
  initialAttendees,
}: RSVPPanelProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isAttending, setIsAttending] = useState(initialAttending);
  const [attendees, setAttendees] = useState(initialAttendees);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsAttending(initialAttending);
    setAttendees(initialAttendees);
    setError(null);
  }, [initialAttending, initialAttendees]);

  async function handleClick() {
    if (!user) {
      router.replace("/");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: "POST",
      });

      let errorMessage = "Unable to RSVP for this event.";

      if (!response.ok) {
        try {
          const body: unknown = await response.json();

          if (
            body &&
            typeof body === "object" &&
            "error" in body &&
            typeof body.error === "string"
          ) {
            errorMessage = body.error;
          }
        } catch {
          // Use the fallback message when the response is not JSON.
        }

        if (response.status === 401) {
          router.replace("/");
          return;
        }

        if (response.status === 409) {
          setIsAttending(true);
        }

        setError(errorMessage);
        return;
      }

      const body = (await response.json()) as RSVPResponse;
      setAttendees(body.attendees);
      setIsAttending(true);
    } catch {
      setError("Unable to RSVP for this event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const label = isAttending ? "Attending" : isSubmitting ? "RSVPing…" : "RSVP";

  return (
    <>
      {isAttending && attendees.length > 0 ? (
        <section className="mt-4 border-t border-gray-100 pt-4">
          <h4 className="text-sm font-semibold text-gray-900">
            List of Attendees ({attendees.length})
          </h4>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
            {attendees.map((attendee) => (
              <li key={attendee.id} className="pl-1">
                <span className="inline-flex items-center gap-2 align-middle">
                  {attendee.image ? (
                    <img
                      src={attendee.image}
                      alt={attendee.name}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700"
                    >
                      {getInitials(attendee.name)}
                    </span>
                  )}
                  <span>{attendee.name}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-4 flex flex-col items-end gap-2">
        <Button
          label={label}
          onClick={handleClick}
          disabled={isSubmitting || isAttending}
        />
        {error ? (
          <p role="alert" className="max-w-xs text-right text-sm text-red-600">
            {error}
          </p>
        ) : null}
      </div>
    </>
  );
}
