// import React from "react";
import Search from "./components/Search";
import { useState } from "react";

function App() {
  const [searchItem, setSearchItem] = useState('');

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Gr1eat Movies</span> You'll
            Enjoy Without the Hassle
          </h1>
        </header>
        <Search searchItem={searchItem} setSearchItem={setSearchItem} />
        <h1 className="text-white">{searchItem}</h1>
      </div>
    </main>
  );
}

export default App;

// git status
// git add .
// git commit -m "Update project"
// git push
