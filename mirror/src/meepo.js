import io from 'socket.io-client'
import { fromEvent } from 'rxjs'

export class SocketService {
  init() {
    this.socket = io('localhost:4400')
    return this
  }

  onMessage() {
    return fromEvent(this.socket, 'particle_added')
  }

  onZ() {
    return fromEvent(this.socket, 'change_z')
  }


  onColor() {
    return fromEvent(this.socket, 'change_color')
  }

  onColor1() {
    return fromEvent(this.socket, 'change_color1')
  }

  onR() {
    return fromEvent(this.socket, 'r')
  }

  onG() {
    return fromEvent(this.socket, 'g')
  }

  onB() {
    return fromEvent(this.socket, 'b')
  }
}
