import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

export const WordContext = React.createContext();

// const server = "http://localhost:4400";
const server = "https://eng.med--lab.org"
// const coket = "https://eng.med--lab.org/words"
const getWords = async () => {
  const response = await fetch(`${server}/words/`)
  const data = await response.json()
  console.log(data)
  return data;
}

const socket = io(server, { path: '/socket.io' });
// const socket = io(server, { path: '/socket.io' });

// const socket = io.connect(server, {
//   path: '/words/socket.io',
//   reconnectionDelay: 1000,
//   reconnection: true,
//   reconnectionAttempts: 10,
//   // transports: ['websocket'],
//   agent: false,
//   upgrade: false,
//   rejectUnauthorized: false
// });
// const socket = io(server);

console.log(socket)
// const socket = 'fuck';

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
