"use client";

import { useState } from "react";

type CommentProps = {
  commenterName: string;
  profilePicture?: string | null;
  commentText: string;
};

const urlPattern = /(https?:\/\/[^\s]+)/g;

function isGiphyGifUrl(value: string) {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();

    return (
      (hostname === "giphy.com" || hostname.endsWith(".giphy.com")) &&
      url.pathname.toLowerCase().endsWith(".gif")
    );
  } catch {
    return false;
  }
}

export default function Comment({
  commenterName,
  profilePicture,
  commentText,
}: CommentProps) {
  const commenterInitial = commenterName.trim().charAt(0).toUpperCase() || "?";
  const [failedGifUrls, setFailedGifUrls] = useState<Set<string>>(new Set());
  const commentSegments = commentText.split(urlPattern);

  return (
    <article className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4">
      {profilePicture ? (
        <img
          src={profilePicture}
          alt={`${commenterName}'s profile picture`}
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600"
        >
          {commenterInitial}
        </div>
      )}

      <div className="min-w-0">
        <p className="font-semibold text-gray-900">{commenterName}</p>
        <div className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-700">
          {commentSegments.map((segment, index) => {
            if (!isGiphyGifUrl(segment)) {
              return <span key={`${index}-${segment}`}>{segment}</span>;
            }

            if (failedGifUrls.has(segment)) {
              return (
                <a
                  key={`${index}-${segment}`}
                  href={segment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-700"
                >
                  {segment}
                </a>
              );
            }

            return (
              <a
                key={`${index}-${segment}`}
                href={segment}
                target="_blank"
                rel="noopener noreferrer"
                className="my-2 block w-fit max-w-full overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Open GIF in a new tab"
              >
                <img
                  src={segment}
                  alt={`GIF shared by ${commenterName}`}
                  onError={() =>
                    setFailedGifUrls((currentUrls) => {
                      const nextUrls = new Set(currentUrls);
                      nextUrls.add(segment);
                      return nextUrls;
                    })
                  }
                  className="max-h-80 max-w-full rounded-lg object-contain"
                />
              </a>
            );
          })}
        </div>
      </div>
    </article>
  );
}
