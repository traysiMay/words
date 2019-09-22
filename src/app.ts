import * as express from "express";
import * as cors from "cors"
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
  app.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    request.header("Access-Control-Allow-Credentials: false")

    next();
  });
  //   app.get("/", (req: any, res: any) => {
  //     res.sendFile(path.resolve("./client/index.html"));
  //   });
  app.get("/words", async (req: Request, res: Response) => {
    const wordRepo = getRepository(Word);
    const words = await wordRepo.find();
    res.send(words);
  });

  io.on("connection", function (socket: any) {
    console.log("a user connected");
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
    socket.on("message", function (message: any) {
      console.log(message);
      // echo the message back down the
      // websocket connection
      socket.emit("message", message);
    });

    socket.on("addword", async word => {
      const wordRepo = getRepository(Word)
      let fWord = await wordRepo.findOne({ where: { word } })
      if (fWord) {
        fWord.vote += 1
      } else {
        fWord = new Word()
        fWord.word = word;
        fWord.vote = 0
      }
      await wordRepo.save(fWord)
      const allWords = await wordRepo.find()
      io.emit("words", allWords);
      return;
    });

    socket.on("voteword", async word => {
      const wordRepo = getRepository(Word)
      const fWord = await wordRepo.findOne({ where: { word } })
      console.log(fWord)
      if (fWord) {
        fWord.vote += 1
        wordRepo.save(fWord)
        io.emit("updateword", fWord)
      }
      return;
    })
  });


  const server = http.listen(4400, function () {
    console.log("listening on *:4400");
  });
});
