import React, { useEffect, useState } from "react";

import io from "socket.io-client";
export const WordContext = React.createContext();
const server = "http://localhost:4400";

const WordProvider = ({ children }) => {
  const socket = io(server);
  const [words, setWords] = useState([]);

  useEffect(() => {
    socket.on("words", data => {
      console.log(data);
      setWords([...words, data]);
    });

    return () => socket.close();
  });

  return (
    <WordContext.Provider value={{ words, socket }}>
      {children}
    </WordContext.Provider>
  );
};

export default WordProvider;
