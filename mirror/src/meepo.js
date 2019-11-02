import io from 'socket.io-client'
import { fromEvent } from 'rxjs'

export class SocketService {
  init() {
    // this.socket = io('localhost:4400')
    // ***** PROD BLEOW
    const server = "https://eng.med--lab.org";
    this.socket = io(server, { path: "/socket.io", transport: ["websocket"] });
    return this
  }

  onMessage() {
    return fromEvent(this.socket, 'particle_added')
  }

  onZ() {
    return fromEvent(this.socket, 'change_z')
  }

  onAccent() {
    return fromEvent(this.socket, 'change_accent')
  }

  onMainLayer() {
    return fromEvent(this.socket, 'main_layer')
  }

  onOtherLayer() {
    return fromEvent(this.socket, 'other_layer')
  }

  onAnotherLayer() {
    return fromEvent(this.socket, 'another_layer')
  }
}
