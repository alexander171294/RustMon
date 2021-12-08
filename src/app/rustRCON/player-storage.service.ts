import { Injectable } from '@angular/core';
import { IPGeocodeService } from '../Api/ipgeocode.service';
import { Player, PlayerWithStatus } from './Player';

@Injectable({
  providedIn: 'root'
})
export class PlayerStorageService {

  public ipsCountryAssoc: {[key: string]: string} = {};

  constructor(private ipGeo: IPGeocodeService) { }

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
      if(!this.ipsCountryAssoc[addr]) {
        this.ipsCountryAssoc[addr] = this.getCountryFrom(addr);
      }
      (t[1] as PlayerWithStatus).country = this.ipsCountryAssoc[addr];
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


  public getCountryFrom(addr) {
    if(localStorage.getItem('IP-'+addr)) {
      return localStorage.getItem('IP-'+addr);
    }
    this.ipGeo.getIpApi(addr).subscribe(data => {
      this.ipsCountryAssoc[addr] = data.countryCode.toLowerCase();
      localStorage.setItem('IP-'+addr,  data.countryCode.toLowerCase());
    }, e => {
      setTimeout(() => {
        this.ipsCountryAssoc[addr] = undefined;
      }, 1000)
    });
    return 'N/D';
  } 
}
