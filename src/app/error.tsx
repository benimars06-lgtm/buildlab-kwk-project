"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold text-gray-900">
        😬 Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-gray-600">
        {error.message.includes("SQLITE") ||
        error.message.includes("no such table")
          ? "It looks like the database isn't set up yet. Run these commands in your terminal:"
          : "An unexpected error occurred. Try refreshing the page."}
      </p>

      {(error.message.includes("SQLITE") ||
        error.message.includes("no such table")) && (
        <pre className="mt-4 rounded-lg bg-gray-100 p-4 text-left text-sm text-gray-800">
          {`pnpm run db:push\npnpm run seed`}
        </pre>
      )}

      <button
        onClick={reset}
        className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}
