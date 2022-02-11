import { Injectable, EventEmitter } from '@angular/core';
import { EventSck, EventTypeSck } from './EventSck';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private ws?: WebSocket;
  private socketEvent: EventEmitter<EventSck> = new EventEmitter<EventSck>();

  constructor() { }

  connect(url: string): EventEmitter<EventSck> {
    this.ws = new WebSocket(url);
    this.ws.onmessage = (d) => {
      const event = new EventSck();
      event.eventType = EventTypeSck.MESSAGE;
      event.eventData = d;
      this.socketEvent.emit(event);
    };
    this.ws.onclose = () => {
      console.warn('closed');
      const event = new EventSck();
      event.eventType = EventTypeSck.DISCONNECTED;
      this.socketEvent.emit(event);
    };
    this.ws.onerror = (e) => {
      console.error('error', e);
      const event = new EventSck();
      event.eventType = EventTypeSck.ERROR;
      event.eventData = e;
      this.socketEvent.emit(event);
    };
    this.ws.onopen = (d) => {
      const event = new EventSck();
      event.eventType = EventTypeSck.CONNECTED;
      event.eventData = d;
      this.socketEvent.emit(event);
    };
    return this.socketEvent;
  }

  sendMessage(message: any) {
    this.ws?.send(JSON.stringify(message));
  }

}
