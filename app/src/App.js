import React, { useContext, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { WordContext } from "./Context";

function App() {
  const { words, socket } = useContext(WordContext);
  const [word, setWord] = useState("");

  const addWord = () => {
    console.log("hi");
    socket.emit("addword", word);
  };

  const handleWord = e => {
    setWord(e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {words.map(w => (
            <div>{w}</div>
          ))}
          <input onChange={handleWord} />
          <button onClick={addWord}>HIT ME</button>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
