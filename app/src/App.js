import React, { useEffect, useContext, useState } from "react";
import { WordContext } from "./Context";
import D3 from "./D3";

function App() {
  const { words, socket, votes } = useContext(WordContext);
  const [word, setWord] = useState("");
  // const [forceUpdate, _] = useState()
  // useEffect(() => {
  //   console.log('hi')
  //   _(votes)
  // }, [votes])

  const addWord = (e) => {
    e.preventDefault()
    socket.emit("addword", word);
  };

  const handleWord = e => {
    setWord(e.target.value);
  };

  const voteWord = w => {
    socket.emit("voteword", w)
  }

  return (
    <div className="App">
      <D3 data={votes} />
      {words.map(w => (
        <div key={w} > <div >{w}-{votes[w]}</div> <button onClick={() => voteWord(w)}>+</button></div>
      ))}
      <form>
        <input onChange={handleWord} />
        <button type="submit" onClick={addWord}>HIT ME</button>
      </form>
    </div>
  );
}

export default App;
