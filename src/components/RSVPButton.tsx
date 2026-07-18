"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useAuth } from "@/lib/auth";

type RSVPButtonProps = {
  eventId: string;
  initialAttending: boolean;
};

export default function RSVPButton({
  eventId,
  initialAttending,
}: RSVPButtonProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isAttending, setIsAttending] = useState(initialAttending);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsAttending(initialAttending);
    setError(null);
  }, [initialAttending]);

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

      setIsAttending(true);
      router.refresh();
    } catch {
      setError("Unable to RSVP for this event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const label = isAttending ? "Attending" : isSubmitting ? "RSVPing…" : "RSVP";

  return (
    <div className="flex flex-col items-end gap-2">
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
  );
}
