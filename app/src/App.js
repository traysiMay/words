import React, { useContext, useState } from "react";
import { WordContext } from "./Context";
import styled from "styled-components";
import D3 from "./D3";

const Colors = {
  mood: "#e159e1",
  object: "#53e553",
  sensibility: "#ffff82"
};

const Container = styled.div`
  background: ${props => props.color};
  height: 100%;
`;

const CatContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  text-align: center;
  padding: 0 3rem;
`;

const CatButton = styled.div`
  padding: 1rem;
`;
const MoodS = styled(CatButton)`
  background: ${Colors.mood};
`;

const ObjectS = styled(CatButton)`
  background: ${Colors.object};
`;
const SenseS = styled(CatButton)`
  background: ${Colors.sensibility};
`;

function App() {
  const { wordz, socket, votez } = useContext(WordContext);
  const [color, setColor] = useState("mood");
  const [word, setWord] = useState("");

  const addWord = e => {
    e.preventDefault();
    socket.emit("addword", word);
  };

  const handleWord = e => {
    setWord(e.target.value);
  };

  const voteWord = w => {
    socket.emit("voteword", w);
  };

  const changeColor = e => {
    setColor(e.target.innerHTML);
  };

  return (
    <Container color={Colors[color]}>
      <D3 data={votez} />
      <CatContainer>
        <MoodS onClick={changeColor}>mood</MoodS>
        <ObjectS onClick={changeColor}>object</ObjectS>
        <SenseS onClick={changeColor}>sensibility</SenseS>
      </CatContainer>
      {wordz.map(w => (
        <div key={w}>
          {" "}
          <div>
            {w}-{votez[w]}
          </div>{" "}
          <button onClick={() => voteWord(w)}>+</button>
        </div>
      ))}
      <form>
        <input onChange={handleWord} />
        <button type="submit" onClick={addWord}>
          ADD
        </button>
      </form>
    </Container>
  );
}

export default App;
