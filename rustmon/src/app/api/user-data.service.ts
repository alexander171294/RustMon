import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MapData } from './MapDataDto';
import { UserDataDTO } from './UserDataDto';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private http: HttpClient) { }

  public getBatchUserData(items: UDataItem[]): Observable<UserDataDTO[]> {
    return this.http.post<UserDataDTO[]>(`${environment.uDataApi}/udata`, items);
  }

  public ping() {
    return this.http.get(`${environment.uDataApi}/ping`, {responseType: 'text'});
  }

  public getUserData(steamId: string, ip?: string): Observable<UserDataDTO> {
    let uri = `${environment.uDataApi}/udata?steamID=${steamId}`;
    if(ip) {
      uri += `&ip=${ip}`;
    }
    return this.http.get<UserDataDTO>(uri);
  }

  public clearCache(steamId: string): Observable<string> {
    return this.http.get(`${environment.uDataApi}/invalidate?steamID=${steamId}`, {responseType: 'text'});
  }

  public getMap(seed: string, size: string) {
    return this.http.get<MapData>(`${environment.uDataApi}/mapdata?seed=${seed}&size=${size}`);
  }

  public mapInvalidateCache(seed: string, size: string) {
    return this.http.get<MapData>(`${environment.uDataApi}/mapdata/invalidate?seed=${seed}&size=${size}`);
  }

  public getPluginUpdates(data: any) {
    return this.http.post(`${environment.uDataApi}/plugins`, data);
  }

  public getLastVersion() {
    return this.http.get(`https://raw.githubusercontent.com/alexander171294/RustMon/master/version.txt`, {
      responseType: 'text'
    });
  }
}

export interface UDataItem {
  steamID: string;
  ip: string;
}
