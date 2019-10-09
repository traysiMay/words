import React, { useContext, useRef, useState } from "react";
import { WordContext } from "./Context";
import D3 from "./D3";
import * as chroma from "chroma-js"

import {IContainer, Container, Raptor, BContainer, LogContainer} from "./styles"

function App() {
  const { wordz, socket, votez } = useContext(WordContext);
  const [color, setColor] = useState("mood");
  const [word, setWord] = useState("");
  const [raptor, setRaptor] = useState(localStorage.getItem('raptor'));
  const raptorRef = useRef();

  const addWord = e => {
    e.preventDefault();
    if (word.length === 0) return

    socket.emit("add_particle", chroma.random().hex())
    return

    document.getElementById('add-word').value=''
    socket.emit("addword", { word, raptor, color: chroma.random().hex(), text_color: chroma.random().hex() });
  };

  const handleWord = e => {
    setWord(e.target.value);
  };

  const voteWord = w => {
    socket.emit("voteword", w);
  };

  const changeColor = e => {
    setColor(chroma.random())
    return
    setColor(e.target.innerHTML);
  };

  const raptorLogin = () => {
    localStorage.setItem('raptor', raptorRef.current.value)
    setRaptor(raptorRef.current.value)
  }

  if (!raptor) {
    return (
      <div>
        <form><div style={{textAlign:'center'}}>
        <h1 style={{textAlign:'center'}}>who are you</h1>
        <input style={{border:'2px black solid'}} ref={raptorRef}></input>
       <div><button style={{background:'yellow', margin:'1rem'}} onClick={raptorLogin}>
          corntinue🌽
        </button></div> </div>
        </form>
      </div>
    );
  }
  console.log(votez)
  return (
    <Container onClick={changeColor} color={"black"}>
      <Raptor>hi {raptor}</Raptor>
      <D3 socket={socket} data={votez} />
      {/* <CatContainer>
        <MoodS onClick={changeColor}>mood</MoodS>
        <ObjectS onClick={changeColor}>object</ObjectS>
        <SenseS onClick={changeColor}>sensibility</SenseS>
      </CatContainer> */}
       <form>
        <IContainer><input id="add-word" placeholder="add a word :)" type="text" onChange={handleWord} /></IContainer>
        <BContainer><button type="submit" onClick={addWord}>
          ADD
        </button></BContainer>
      </form>
    <LogContainer>
      {wordz.map(w => (
        <div key={w}>
          <div>
            {w} was added by {votez[w] && votez[w].publisher}
          </div>
          {/* <BContainer><button onClick={() => voteWord(w)}>+</button></BContainer> */}
        </div>
      ))}
</LogContainer>
    </Container>
  );
}

export default App;
