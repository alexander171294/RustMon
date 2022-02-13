import { Injectable } from '@angular/core';
import { UDataItem, UserDataService } from '../api/user-data.service';
import { UserDataDTO } from '../api/UserDataDto';
import { Player, PlayerWithStatus } from './Player';

@Injectable({
  providedIn: 'root'
})
export class PlayerStorageService {

  public userDataSteam: {[key: string]: UserDataDTO | undefined} = {};
  public firstTime: boolean = true;
  public isBatching: boolean = false;

  constructor(private userDataSrv: UserDataService) { }

  savePlayerList(players: Player[], onlyOnline: boolean): PlayerWithStatus[] {
    const playersWS: PlayerWithStatus[] = [];
    let oldPlayers = JSON.parse(localStorage.getItem('players') as string);
    oldPlayers = oldPlayers ? oldPlayers : {};
    const oPl: string[] = [];
    players.forEach(el => {
      oldPlayers[el.SteamID] = el;
      oPl.push(el.SteamID);
    });
    if(this.firstTime) {
      this.getBatchUserData(oldPlayers).then((pdata) => {
        pdata.forEach(data => {
          this.userDataSteam[data.userData.steamid] = data;
        });
        this.firstTime = false;
      }).catch(e => {
        console.error(e);
      });
      return [];
    } else {
      localStorage.setItem('players', JSON.stringify(oldPlayers));
      Object.entries(oldPlayers).forEach(t => {
        const addr = (t[1] as Player).Address.split(':')[0];
        const id64 = (t[1] as Player).SteamID;
        if(!this.userDataSteam[id64]) {
          this.userDataSteam[id64] = this.getUserData(addr, id64);
        }
        (t[1] as PlayerWithStatus).country = (this.userDataSteam[id64] != undefined && this.userDataSteam[id64]?.countryCode) ? (this.userDataSteam[id64] as UserDataDTO).countryCode.toLowerCase() : '';
        (t[1] as PlayerWithStatus).vac = this.userDataSteam[id64]?.vacData;
        (t[1] as PlayerWithStatus).steamData = this.userDataSteam[id64]?.userData;
        (t[1] as PlayerWithStatus).notes = localStorage.getItem(`note-${id64}`);
        if (onlyOnline) {
          if (oPl.indexOf(t[0]) >= 0) {
            (t[1] as PlayerWithStatus).online = true;
            playersWS.push(t[1] as PlayerWithStatus);
          }
        } else {
          (t[1] as PlayerWithStatus).online = oPl.indexOf(t[0]) >= 0;
          playersWS.push(t[1] as PlayerWithStatus);
        }
      });
      return playersWS;
    }
  }

  public getCachedUData(id64: string): UserDataDTO {
    if(this.userDataSteam[id64]) {
      return this.userDataSteam[id64] as UserDataDTO;
    } else {
      return new UserDataDTO();
    }
  }

  public getUserData(addr: string, id64: string): UserDataDTO {
    this.userDataSrv.getUserData(id64, addr).subscribe(data => {
      this.userDataSteam[id64] = data;
    }, e => {
      setTimeout(() => {
        this.userDataSteam[addr] = undefined;
      }, 1000)
    });
    return new UserDataDTO();
  }

  public getBatchUserData(oldPlayers: any): Promise<UserDataDTO[]> {
    if (this.isBatching) {
      return Promise.reject('batch running');
    }
    this.isBatching = true;
    const pys: UDataItem[] = [];
    Object.entries(oldPlayers).forEach((t: unknown) => {
      const player = t as Player;
      pys.push({
        ip: player.Address,
        steamID: player.SteamID
      });
    });
    return new Promise<UserDataDTO[]>((res, rej) => {
      this.userDataSrv.getBatchUserData(pys).subscribe(data => {
        res(data);
      }, e => {
        rej(e);
      });
    });
  }

  public saveNote(id64: string, note: string) {
    localStorage.setItem(`note-${id64}`, note);
  }

}
