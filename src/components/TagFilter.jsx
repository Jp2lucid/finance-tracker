import React from 'react';

export default function TagFilter({ tags, activeTag, onTagChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        onClick={() => onTagChange(null)}
        className={`badge cursor-pointer text-xs px-2.5 py-1 ${!activeTag ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
      >
        All
      </button>
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => onTagChange(activeTag === tag ? null : tag)}
          className={`badge cursor-pointer text-xs px-2.5 py-1 ${activeTag === tag ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}
