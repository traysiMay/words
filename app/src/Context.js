import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

export const WordContext = React.createContext();

const server = "http://localhost:4400";
const getWords = async () => {
  const response = await fetch(`${server}/words`)
  const data = await response.json()
  return data;
}

const socket = io(server);

const WordProvider = ({ children }) => {
  const [words, setWords] = useState([])
  const [votes, setVotes] = useState({})


  useEffect(() => {
    console.log('waT')
    socket.on("words", data => {
      const votes = {}
      const wordList = data.map(w => {
        votes[w.word] = w.vote
        return w.word
      })
      setWords(wordList);
      setVotes(votes)
    });

    getWords().then(words => {
      const votes = {}
      const allWords = words.map(w => {
        votes[w.word] = w.vote
        return w.word
      })
      setWords(allWords)
      setVotes(votes)
    })
    return () => socket.close();
  }, []);

  return (
    <WordContext.Provider value={{ words, socket, votes }}>
      {children}
    </WordContext.Provider>
  );
};

export default WordProvider;
