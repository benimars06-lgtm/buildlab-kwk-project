"use client";

import { useState } from "react";

type Resource = {
  id: string;
  title: string;
  description: string;
  url: string;
};

type ResourceSearchProps = {
  resources: Resource[];
};

export default function ResourceSearch({ resources }: ResourceSearchProps) {
  const [query, setQuery] = useState("");

  if (resources.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
        <p className="text-lg font-medium text-gray-400">No resources yet</p>
        <p className="mt-2 text-sm text-gray-400">
          Resources for this community will appear here.
        </p>
      </div>
    );
  }

  const normalizedQuery = query.trim().toLowerCase();
  const filteredResources = resources.filter((resource) => {
    const title = resource.title.toLowerCase();
    const description = resource.description.toLowerCase();

    return (
      title.includes(normalizedQuery) || description.includes(normalizedQuery)
    );
  });

  return (
    <>
      <div className="mb-4">
        <label
          htmlFor="resource-search"
          className="block text-sm font-medium text-gray-700"
        >
          Search resources
        </label>
        <input
          id="resource-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title or description"
          className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {filteredResources.length > 0 ? (
        <div className="space-y-4">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {resource.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {resource.description}
              </p>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                {resource.title}
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-lg font-medium text-gray-400">
            No resources match your search
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Try a different title or description.
          </p>
        </div>
      )}
    </>
  );
}
