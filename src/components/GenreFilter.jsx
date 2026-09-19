import React from "react";

const GenreFilter = ({ genres, selectedGenre, onSelect }) => {
  if (genres.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
      {genres.map((genre) => {
        const isActive = genre.id === selectedGenre;

        return (
          <button
            key={genre.id}
            onClick={() => onSelect(genre.id)}
            className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-light-100 text-primary"
                : "bg-light-100/10 text-light-200 hover:bg-light-100/20"
            }`}
          >
            {genre.name}
          </button>
        );
      })}
    </div>
  );
};

export default GenreFilter;
