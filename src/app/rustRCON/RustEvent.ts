export class RustEvent {
  public type: REType;
  public data: any;
  public raw: string;
  public rawtype: string;
}

export enum REType {
  CONNECTED = -3,
  ERROR = -2,
  DISCONNECT = -1,
  UNKOWN = 0,
  GET_INFO = 1000,
  CHAT_STACK = 1001,
  PLAYERS = 1002,
  BAN_LIST = 1003
}
