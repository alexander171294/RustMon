import { first, Observable } from 'rxjs';
import { environment } from 'src/environment';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios'
import { DataResponse, VacResponse } from 'src/UserDataDTO';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ValveApiService {

  public readonly steamBanApi = 'https://api.steampowered.com/ISteamUser/GetPlayerBans/v1?key=' + environment.steamApiKey + '&steamids=${STEAM_ID}&format=json';
  public readonly steamUserApi = 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + environment.steamApiKey + '&steamids==${STEAM_ID}&format=json';

  constructor(private httpService: HttpService) { }

  public getVacs(uid64: string): Observable<AxiosResponse<PlayerVacsResponse>> {
    return this.httpService.get<PlayerVacsResponse>(
      this.steamBanApi.replace('${STEAM_ID}', uid64)
    ).pipe(first());
  }

  public getUserData(uid64: string): Observable<AxiosResponse<PlayerDataResponse>> {
    return this.httpService.get<PlayerDataResponse>(
      this.steamUserApi.replace('${STEAM_ID}', uid64)
    ).pipe(first());
  }
}

export class PlayerVacsResponse {
  players: VacResponse[];
}


export class PlayerDataResponse {
  public players: DataResponse;
}


