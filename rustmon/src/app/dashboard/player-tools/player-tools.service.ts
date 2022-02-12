import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayerToolsService {

  constructor() { }

  public saveAutoKick(ping: number, message: string) {
    localStorage.setItem('autokick', JSON.stringify({
      ping,
      message
    }));
  }

  public getAutoKick(): AutoKick {
    return JSON.parse(localStorage.getItem('autokick') as string);
  }
}

export interface AutoKick {
  ping: number;
  message:string;
}