import * as express from 'express'
import * as cors from 'cors'
import * as socketio from 'socket.io'
import * as path from 'path'
import { Request, Response } from 'express'
import * as bodyParser from 'body-parser'
import { createConnection, getRepository } from 'typeorm'
import { Word } from './entity/Word'
import { Category } from './entity/Category'

createConnection().then(connection => {
  const app = express()
  let http = require('http').Server(app)
  let io = require('socket.io')(http)
  app.use(bodyParser.json())
  app.use(cors())
  //   app.get("/", (req: any, res: any) => {
  //     res.sendFile(path.resolve("./client/index.html"));
  //   });
  app.get('/words', async (req: Request, res: Response) => {
    const wordRepo = getRepository(Word)
    const words = await wordRepo.find()
    res.send(words)
  })

  io.on('connection', function (socket: any) {
    console.log('a user connected')
    socket.on('disconnect', function () {
      console.log('user disconnected')
    })

    socket.on('addword', async ({ color, text_color, word, raptor }) => {
      const wordRepo = getRepository(Word)
      const catRepo = getRepository(Category)
      let fWord = await wordRepo.findOne({ where: { word } })
      const isNew = !fWord
      if (!isNew) {
        fWord.vote += 1
      } else {
        fWord = new Word()
        fWord.word = word
        fWord.vote = 0
        fWord.publisher = raptor
        fWord.color = color
        fWord.text_color = text_color
        fWord.category = await catRepo.findOne({ where: { name: 'mood' } })
      }
      await wordRepo.save(fWord)
      io.emit('updateword', { ...fWord, isNew })
      return
    })

    socket.on('voteword', async word => {
      const wordRepo = getRepository(Word)
      const fWord = await wordRepo.findOne({ where: { word } })
      console.log(fWord)
      if (fWord) {
        fWord.vote += 1
        wordRepo.save(fWord)
        io.emit('updateword', fWord)
      }
      return
    })

    socket.on('colorword', async word => {
      const wordRepo = getRepository(Word)
      const fWord = await wordRepo.findOne({ where: { word: word.word } })
      console.log(word)

      if (fWord) {
        if (word.type === 'circ') fWord.color = word.color
        if (word.type === 'text') fWord.text_color = word.color
        wordRepo.save(fWord)
        io.emit('updateword', fWord)
      }
      return
    })

    socket.on('add_particle', async color => {
      io.emit('particle_added', color)
    })

    socket.on('change_z', async z => {
      io.emit('change_z', z)
    })

    socket.on('change_color', async c => {
      io.emit('change_color', c)
    })

    socket.on('change_color1', async c => {
      io.emit('change_color1', c)
    })

    socket.on('r', async r => {
      io.emit('r', r)
    })
    socket.on('g', async g => {
      io.emit('g', g)
    })
    socket.on('b', async b => {
      io.emit('b', b)
    })
  })

  const server = http.listen(4400, function () {
    console.log('listening on *:4400')
  })
})
