import React, { useEffect, useReducer } from "react";
import io from "socket.io-client";

export const WordContext = React.createContext();

let server = "http://localhost:4400";
// server = "https://eng.med--lab.org";
const getWords = async () => {
  const response = await fetch(`${server}/words/`);
  const data = await response.json();
  return data;
};

// const socket = io(server);
const socket = io(server, { path: "/socket.io", transport: ["websocket"] });

const voteReducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT":
      const {
        word: { color, text_color, word, vote, publisher }
      } = action;
      return { ...state, [word]: {vote, color, text_color, publisher} };
    case "init":
      return action.newState;
    default:
      return state;
  }
};

const wordReducer = (state, action) => {
  switch (action.type) {
    case "init":
      return action.words;
    case "ADD_WORD":
      return [...state, action.word.word];
  }
};

const WordProvider = ({ children }) => {
  const [wordz, dispatchWord] = useReducer(wordReducer, []);
  const [votez, dispatchVote] = useReducer(voteReducer, {});

  useEffect(() => {
    socket.on("updateword", word => {
      if (word.isNew) dispatchWord({ type: "ADD_WORD", word });
      dispatchVote({ type: "INCREMENT", word });
    });

    getWords().then(words => {
      const votes = {};
      const allWords = words.map(w => {
        votes[w.word] = {vote:w.vote, color:w.color, text_color:w.text_color, publisher: w.publisher};
        return w.word;
      });
      dispatchWord({ type: "init", words: allWords });
      dispatchVote({ type: "init", newState: votes });
    });
    return () => socket.close();
  }, []);
  return (
    <WordContext.Provider value={{ wordz, socket, votez }}>
      {children}
    </WordContext.Provider>
  );
};

export default WordProvider;
