"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var typeorm_1 = require("typeorm");
var Word_1 = require("./entity/Word");
typeorm_1.createConnection().then(function (connection) {
    var app = express();
    var http = require("http").Server(app);
    var io = require("socket.io")(http);
    app.use(bodyParser.json());
    app.get("/", function (req, res) {
        res.sendFile(path.resolve("./client/index.html"));
    });
    app.get("/words", function (req, res) {
        var wordRepo = typeorm_1.getRepository(Word_1.Word);
        var words = wordRepo.find();
        res.send({ words: words });
    });
    io.on("connection", function (socket) {
        console.log("a user connected");
        // whenever we receive a 'message' we log it out
        socket.on("message", function (message) {
            console.log(message);
        });
    });
    io.on("connection", function (socket) {
        console.log("a user connected");
        socket.on("message", function (message) {
            console.log(message);
            // echo the message back down the
            // websocket connection
            socket.emit("message", message);
        });
    });
    var server = http.listen(3000, function () {
        console.log("listening on *:3000");
    });
});
