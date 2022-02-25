import { ConfigData } from './../../../../../discord-bot/src/discord/ConfigData';
import { BotData } from './BotData';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BotService {

  constructor(private httC: HttpClient) { }

  public getSession(): string {
    return localStorage.getItem('discordSession');
  }

  public getLoginLink(): Observable<string> {
    return this.httC.get(`${environment.discordApi}/discord`, {responseType: 'text'});
  }

  public getBotData(): Observable<BotData> {
    const token = this.getSession();
    return this.httC.get<BotData>(`${environment.discordApi}/discord?accessToken=${token}`);
  }

  public remove(): Observable<void> {
    const token = this.getSession();
    return this.httC.delete<void>(`${environment.discordApi}/discord?accessToken=${token}`);
  }

  public setDefinition(config: ConfigData): Observable<void> {
    const token = this.getSession();
    config.accessToken = token;
    return this.httC.post<void>(`${environment.discordApi}/discord`, config);
  }

}
