import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';

@Injectable()
export class SocketService {

  constructor(private socket: Socket) { }

  public sendMessage(msg: string){
    this.socket.emit('message', msg);
  }

  public getMessage() {
    return this.socket
      .fromEvent('message')
      .map((data: any) => data.msg);
  }
}
