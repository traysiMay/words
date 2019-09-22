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
  app.use(cors({ origin: '*' }))
  // const server = app.listen(4400);
  var server = require('http').Server(app);
  var io = require('socket.io')(server);
  io.origins(['http://localhost:3000'])

  server.listen(4400, '127.0.0.1');
  // let http = require("http").Server(app);
  // app.use(function (req, res, next) {

  //   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  //   res.header('Access-Control-Allow-Credentials', 'true');
  //   next();
  // });
  // let io = require("socket.io").listen(server);
  app.use(bodyParser.json());

  //   app.get("/", (req: any, res: any) => {
  //     res.sendFile(path.resolve("./client/index.html"));
  //   });
  app.get("/words", async (req: Request, res: Response) => {
    const wordRepo = getRepository(Word);
    const words = await wordRepo.find();
    res.send(words);
  });

  app.get("/socket.io", async (req: Request, res: Response) => {
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


  // const server = http.listen(4400, function () {
  //   console.log("listening on *:4400");
  // });
});
