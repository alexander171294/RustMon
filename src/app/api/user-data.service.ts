import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserDataDTO } from './UserDataDto';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private http: HttpClient) { }

  public getUserData(steamId: string, ip: string): Observable<UserDataDTO> {
    return this.http.get<UserDataDTO>(`${environment.uDataApi}/udata?steamID=${steamId}&ip=${ip}`);
  }
  
  public clearCache(steamId: string): Observable<string> {
    return this.http.get<string>(`${environment.uDataApi}/invalidate?steamID=${steamId}`);
  }
}
