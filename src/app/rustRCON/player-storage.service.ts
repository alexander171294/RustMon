import { Injectable } from '@angular/core';
import { UserDataService } from '../api/user-data.service';
import { UserDataDTO } from '../api/UserDataDto';
import { Player, PlayerWithStatus } from './Player';

@Injectable({
  providedIn: 'root'
})
export class PlayerStorageService {

  public userDataSteam: {[key: string]: UserDataDTO} = {};

  constructor(private userDataSrv: UserDataService) { }

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
      const addr = (t[1] as Player).Address.split(':')[0];
      const id64 = (t[1] as Player).SteamID;
      if(!this.userDataSteam[id64]) {
        this.userDataSteam[id64] = this.getUserData(addr, id64);
      }
      (t[1] as PlayerWithStatus).country = this.userDataSteam[id64].countryCode ? this.userDataSteam[id64].countryCode.toLowerCase() : undefined;
      (t[1] as PlayerWithStatus).vac = this.userDataSteam[id64].vacData;
      (t[1] as PlayerWithStatus).steamData = this.userDataSteam[id64].userData;
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

  public getCachedUData(id64): UserDataDTO {
    if(this.userDataSteam[id64]) {
      return this.userDataSteam[id64];
    } else {
      return new UserDataDTO();
    }
  }

  public getUserData(addr, id64): UserDataDTO {
    // if(localStorage.getItem('USRV-' + id64)) {
    //   return JSON.parse(localStorage.getItem('USRV-' + id64));
    // }
    this.userDataSrv.getUserData(id64, addr).subscribe(data => {
      this.userDataSteam[id64] = data;
      // localStorage.setItem('USRV-' + id64, JSON.stringify(data));
    }, e => {
      setTimeout(() => {
        this.userDataSteam[addr] = undefined;
      }, 1000)
    });
    return new UserDataDTO();
  }

}
