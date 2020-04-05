import { Injectable } from '@angular/core';
import { Player, PlayerWithStatus } from './Player';

@Injectable({
  providedIn: 'root'
})
export class PlayerStorageService {

  constructor() { }

  savePlayerList(players: Player[]): PlayerWithStatus[] {
    const playersWS = [];
    let oldPlayers = JSON.parse(localStorage.getItem('players'));
    oldPlayers = oldPlayers ? oldPlayers : {};
    const oPl = [];
    players.forEach(el => {
      oldPlayers[el.SteamID] = el;
      oPl.push(el.SteamID);
    });
    localStorage.setItem('players', JSON.stringify(oldPlayers));
    Object.entries(oldPlayers).forEach(t => {
      (t[1] as PlayerWithStatus).online = oPl.indexOf(t[0]) >= 0;
      playersWS.push(t[1]);
    });
    return playersWS;
  }
}
