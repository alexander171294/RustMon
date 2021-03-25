import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ValveApiService {

  public readonly steamUserApi = 'https://api.steampowered.com/ISteamUser/GetPlayerBans/v1?key=' + environment.steamApiKey + '&steamids=${STEAM_ID}&format=json';

  constructor(private httpC: HttpClient) { }

  public getVacs(uid64: string): Observable<PlayerVacsResponse> {
    return this.httpC.get<PlayerVacsResponse>(
      this.steamUserApi.replace('${STEAM_ID}', uid64)
    );
  }
}

export class PlayerVacsResponse {
  players: VacResponse[];
}

export class VacResponse {
  public SteamId: string;
  public CommunityBanned: boolean;
  public VACBanned: boolean;
  public NumberOfVACBans: number;
  public DaysSinceLastBan: number;
  public NumberOfGameBans: number;
  public EconomyBan: string;
}
