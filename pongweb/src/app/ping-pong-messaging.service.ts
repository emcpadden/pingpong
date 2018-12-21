import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class PingPongMessagingService {

  constructor(private socket: Socket) {

  }

  sendMessage(msg: string){
    this.socket.emit("message", msg);
  }

  getConnection() {
    return this.socket
    .fromEvent("connection");
  }

  getMessage() {
      return this.socket
          .fromEvent("message");
/*          .pipe(
            map( data => data["msg"] )
          );
          */
  }
}
