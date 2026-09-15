import React from 'react'

const Search = ({ searchItem, setSearchItem }) => {
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search" />
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchItem}
          onChange={(event) => setSearchItem(event.target.value)}
        />
      </div>
    </div>
  )
}

export default Search
