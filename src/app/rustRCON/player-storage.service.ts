import { Injectable } from '@angular/core';
import { Player, PlayerWithStatus } from './Player';

@Injectable({
  providedIn: 'root'
})
export class PlayerStorageService {

  constructor() { }

  savePlayerList(players: Player[], onlyOnline: boolean): PlayerWithStatus[] {
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
      console.log('Only online: ', onlyOnline);
      if (onlyOnline) {
        if (oPl.indexOf(t[0]) >= 0) {
          (t[1] as PlayerWithStatus).online = true;
          playersWS.push(t[1]);
        }
      } else {
        (t[1] as PlayerWithStatus).online = oPl.indexOf(t[0]) >= 0;
        playersWS.push(t[1]);
      }
    });
    return playersWS;
  }
}
