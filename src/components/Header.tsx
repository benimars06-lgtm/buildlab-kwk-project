"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { SEED_USERS } from "@/lib/seed-users";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const { user, login, logout } = useAuth();
  const [showUserPicker, setShowUserPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    if (!showUserPicker) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowUserPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserPicker]);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-gray-900">
          🏘️ Community Hub
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/profile"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Profile
              </Link>
              <div className="flex items-center gap-2">
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">
                  {user.name}
                </span>
              </div>
              <button
                onClick={logout}
                className="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
              >
                Log out
              </button>
            </>
          ) : (
            <div className="relative" ref={pickerRef}>
              <button
                onClick={() => setShowUserPicker(!showUserPicker)}
                className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Log in
              </button>
              {showUserPicker && (
                <div className="absolute right-0 top-10 z-10 w-56 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                  <p className="mb-2 px-2 text-xs font-medium text-gray-500">
                    Pick a user (dev mode)
                  </p>
                  {SEED_USERS.map((seedUser) => (
                    <button
                      key={seedUser.id}
                      onClick={() => {
                        login(seedUser);
                        setShowUserPicker(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-gray-100"
                    >
                      <img
                        src={seedUser.image}
                        alt={seedUser.name}
                        className="h-6 w-6 rounded-full"
                      />
                      {seedUser.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
