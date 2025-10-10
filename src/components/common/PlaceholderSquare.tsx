import React from "react";

type PlaceholderSquareProps = {
  title: string;
  description: string;
  steps?: string[];
  docsLink?: string;
};

export default function PlaceholderSquare({
  title,
  description,
  steps = [],
  docsLink,
}: PlaceholderSquareProps) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-4 md:p-6 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-blue-600 text-xl text-white">
          📌
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {description}
          </p>
          {steps.length > 0 && (
            <ol className="mt-3 list-inside list-decimal space-y-1 text-sm text-gray-600 dark:text-gray-300">
              {steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          )}
          {docsLink && (
            <a
              className="mt-3 inline-block text-sm text-blue-600 hover:underline"
              href={docsLink}
              target="_blank"
              rel="noreferrer"
            >
              Documentation
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
