import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path";
import { Request, Response } from "express";
import * as bodyParser from "body-parser";
import { createConnection, getRepository } from "typeorm";
import { Word } from "./entity/Word";

createConnection().then(connection => {
  const app = express();
  let http = require("http").Server(app);
  let io = require("socket.io")(http);
  app.use(bodyParser.json());
  //   app.get("/", (req: any, res: any) => {
  //     res.sendFile(path.resolve("./client/index.html"));
  //   });
  app.get("/words", function(req: Request, res: Response) {
    const wordRepo = getRepository(Word);
    const words = wordRepo.find();
    res.send({ words });
  });

  io.on("connection", function(socket: any) {
    console.log("a user connected");
    socket.on("message", function(message: any) {
      console.log(message);
      // echo the message back down the
      // websocket connection
      socket.emit("message", message);
    });
    socket.on("addword", word => {
      console.log(word);
      io.emit("words", word);
      return;
    });
  });
  const server = http.listen(4400, function() {
    console.log("listening on *:4400");
  });
});
