import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ValveApiService {

  private static readonly steamUserApi = 'https://api.steampowered.com/ISteamUser/GetPlayerBans/v1//?key=' + environment.steamApiKey + '&steamids=${STEAM_ID}&format=json';

  constructor() { }

  public getVacs() {

  }
}
