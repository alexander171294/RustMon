export class EventSck {
  public eventType?: EventTypeSck;
  public eventData: any;
}

export enum EventTypeSck {
  CONNECTED,
  DISCONNECTED,
  ERROR,
  MESSAGE
}
