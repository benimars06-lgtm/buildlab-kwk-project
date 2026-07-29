"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/Button";

type GifPickerProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (gifUrl: string) => void;
};

type GifResult = {
  id: string;
  title: string;
  previewUrl: string;
  url: string;
};

type GiphyResponse = {
  data: {
    id: string;
    title: string;
    images: {
      fixed_width: {
        url: string;
      };
      original: {
        url: string;
      };
    };
  }[];
};

export default function GifPicker({ open, onClose, onSelect }: GifPickerProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<GifResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const fetchGifs = useCallback(async (searchTerm = "") => {
    const apiKey = process.env.NEXT_PUBLIC_GIPHY_API_KEY;

    if (!apiKey) {
      setResults([]);
      setError("The GIPHY API key is missing.");
      return;
    }

    const trimmedSearch = searchTerm.trim();
    const endpoint = trimmedSearch ? "search" : "trending";
    const params = new URLSearchParams({
      api_key: apiKey,
      limit: "12",
      rating: "g",
    });

    if (trimmedSearch) {
      params.set("q", trimmedSearch.slice(0, 50));
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/${endpoint}?${params}`
      );

      if (!response.ok) {
        throw new Error("GIPHY request failed.");
      }

      const data: GiphyResponse = await response.json();
      const nextResults = data.data.map((gif) => ({
        id: gif.id,
        title: gif.title,
        previewUrl: gif.images.fixed_width.url,
        url: gif.images.original.url,
      }));

      setResults(nextResults);
    } catch {
      setError("Unable to load GIFs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const closePicker = useCallback(() => {
    setSearch("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    searchInputRef.current?.focus();
    void fetchGifs();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closePicker();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closePicker, fetchGifs, open]);

  function handleSearch() {
    const searchTerm = search.trim();

    if (!searchTerm || loading) return;
    void fetchGifs(searchTerm);
  }

  function handleSelect(gifUrl: string) {
    onSelect(gifUrl);
    closePicker();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closePicker();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="gif-picker-title"
        aria-describedby="gif-picker-description"
        className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="gif-picker-title"
              className="text-xl font-semibold text-gray-900"
            >
              Add a GIF
            </h2>
            <p
              id="gif-picker-description"
              className="mt-1 text-sm text-gray-600"
            >
              Search GIPHY and select a GIF to add to your comment.
            </p>
          </div>
          <button
            type="button"
            onClick={closePicker}
            aria-label="Close GIF picker"
            className="rounded-md px-2 py-1 text-xl leading-none text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            &times;
          </button>
        </div>

        <div className="mt-5 flex gap-2">
          <label htmlFor="gif-search" className="sr-only">
            Search for a GIF
          </label>
          <input
            ref={searchInputRef}
            id="gif-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSearch();
              }
            }}
            placeholder="Search for a GIF"
            maxLength={50}
            disabled={loading}
            className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
          />
          <Button
            label={loading ? "Searching..." : "Search"}
            onClick={handleSearch}
            disabled={loading || !search.trim()}
          />
        </div>

        <div
          className="mt-5 max-h-80 overflow-y-auto"
          aria-live="polite"
          aria-busy={loading}
        >
          {loading ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-6 py-10 text-center">
              <p className="text-sm font-medium text-gray-700">
                Loading GIFs...
              </p>
            </div>
          ) : error ? (
            <div
              className="rounded-lg border border-red-200 bg-red-50 px-6 py-10 text-center"
              role="alert"
            >
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {results.map((gif) => (
                <button
                  key={gif.id}
                  type="button"
                  onClick={() => handleSelect(gif.url)}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <img
                    src={gif.previewUrl}
                    alt={gif.title || "GIF search result"}
                    className="aspect-square h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
              <p className="text-sm font-medium text-gray-700">
                No GIFs found. Try another search.
              </p>
            </div>
          )}
        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Powered by GIPHY
        </p>
      </section>
    </div>
  );
}
