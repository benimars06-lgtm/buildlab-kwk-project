"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useAuth } from "@/lib/auth";

export default function RSVPButton() {
  const router = useRouter();
  const { user } = useAuth();

  function handleClick() {
    if (!user) {
      router.replace("/");
    }
  }

  return <Button label="RSVP" onClick={handleClick} />;
}
