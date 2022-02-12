import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConnectionHistoryService {

  private connections: ConectionData[] = [];

  private STORAGE_KEY = 'sessions';

  constructor() {
    const sessions = JSON.parse(localStorage.getItem(this.STORAGE_KEY) as string);
    if(sessions) {
      this.connections = sessions;
    }
  }

  public save(server: string, port: string, password: string) {
    const conIdx = this.connections.findIndex(con => con.server == server);
    let connection = new ConectionData();
    if(conIdx >= 0) {
      connection = this.connections[conIdx];
    }
    connection.password = password;
    connection.port = port;
    connection.server = server;
    connection.lastConn = (new Date()).getTime();
    if(conIdx < 0) {
      this.connections.push(connection);
    }
    this.saveServerList();
  }

  public getServerList(): ConectionData[] {
    return this.connections.sort((a,b) => b.lastConn - a.lastConn);
  }

  private saveServerList(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.connections));
  }
}

export class ConectionData {
  public server: string = '';
  public port: string = '';
  public password: string = '';
  public lastConn: number = 0;
} 