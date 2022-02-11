import { SocketService } from '../utils/socket/socket.service';
import { Injectable, EventEmitter } from '@angular/core';
import { EventTypeSck } from '../utils/socket/EventSck';
import { RustEvent, REType } from './RustEvent';
import { RustEventsService } from './rust-events.service';

@Injectable({
  providedIn: 'root'
})
export class RustService {

  private evtRust: EventEmitter<RustEvent> = new EventEmitter<RustEvent>();

  private readonly CONNAME = 'RustMon';

  private connected: boolean = false; 
  private connectionString: string = '';

  constructor(private sck: SocketService, private rustEvents: RustEventsService) { }

  connect(serverIP: string, rconPort: number, rconPasswd: string): EventEmitter<RustEvent> {
    this.connectionString = `${serverIP}`;
    this.sck.connect('ws://' + serverIP + ':' + rconPort + '/' + rconPasswd).subscribe(evt => {
      if (evt.eventType === EventTypeSck.CONNECTED) {
        const re = new RustEvent();
        re.type = REType.CONNECTED;
        this.connected = true;
        this.evtRust.emit(re);
      }
      if (evt.eventType === EventTypeSck.MESSAGE) {
        this.processMessage(evt.eventData, JSON.parse(evt.eventData.data));
      }
      if (evt.eventType === EventTypeSck.DISCONNECTED) {
        const re = new RustEvent();
        re.type = REType.DISCONNECT;
        this.evtRust.emit(re);
        this.connected = false;
      }
      if (evt.eventType === EventTypeSck.ERROR) {
        const re = new RustEvent();
        re.type = REType.ERROR;
        this.evtRust.emit(re);
        this.connected = false;
      }
    });
    return this.evtRust;
  }

  public frontThreadReady() {
    this.getInfo();
    this.chatTail(50);
    this.sysInfo();
  }

  public sysInfo() {
    this.sendCommand('global.sysinfo');
  }

  public getEvtRust() {
    return this.evtRust;
  }

  getInfo() {
    this.sendCommand('serverinfo', REType.GET_INFO);
  }

  players() {
    this.sendCommand('global.playerlist', REType.PLAYERS);
  }

  chatTail(quantity: number) {
    this.sendCommand('chat.tail ' + quantity, REType.CHAT_STACK);
  }

  sendCommand(command: string, cid?: REType) {
    cid = cid ? cid : 0;
    this.sck.sendMessage({
      Message: command,
      Identifier: cid,
      Name: this.CONNAME
    });
  }

  banList() {
    this.sendCommand('banlistex', REType.BAN_LIST);
  }

  processMessage(message: MessageEvent, body: any) {
    if (body.Identifier < 1000) {
      console.log('==>', body);
    }
    const re = new RustEvent();
    try {
      re.data = JSON.parse(body.Message);
    } catch (e) {

    }
    re.raw = body.Message;
    re.type = body.Identifier;
    re.rawtype = body.Type;
    this.rustEvents.process(re);
    this.evtRust.emit(re);
  }

  isConnected() {
    return this.connected;
  }

  public getConnectionString() {
    return this.connectionString;
  }
}
