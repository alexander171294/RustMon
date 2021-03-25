import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IPGeocodeService {

  public readonly geocodeApi = 'https://api.ipstack.com/${IP}?access_key=' + environment.ipstackApiKey;

  constructor(private httpC: HttpClient) { }

  public getIpGeo(ip: string): Observable<IPData> {
    return this.httpC.get<IPData>(this.geocodeApi.replace('${IP}', ip));
  }
}

export class IPData {
  public ip: string;
  public hostname: string;
  public type: string;
  public continent_code: string;
  public continent_name: string;
  public country_code: string;
  public country_name: string;
  public region_code: string;
  public region_name: string;
  public city: string;
  public zip: string;
  public latitude: number;
  public longitude: number;
  public location: IPLocation;
  public time_zone: IPTimeZone;
  public currency: IPCurrency;
  public connection: IPConnection;
  public security: IPSecurity;
}

export class IPLocation {
  public geoname_id: number;
  public capital: string;
  public languages: IPLangs[];
  public country_flags: string;
  public country_flag_emoji: string;
  public country_flag_emoji_unicode: string;
  public calling_code: string;
  public is_eu: boolean;
}

export class IPLangs {
  public code: string;
  public name: string;
  public native: string;
}

export class IPTimeZone {
  public id: string; // "America/Los_Angeles",
  public current_time: string;
  public gmt_offset: number;
  public code: string;
  public is_daylight_saving: boolean;
}

export class IPCurrency {
  public code: string;
  public name: string;
  public plural: string;
  public symbol: string;
  public symbol_native: string;
}

export class IPConnection {
  public asn: string;
  public isp: string;
}

export class IPSecurity {
  public is_proxy: boolean;
  public proxy_type?: string;
  public is_crawler: boolean;
  public crawler_name?: string;
  public crawler_type?: string;
  public is_toor: boolean;
  public threat_level: string;
  public threat_types?: string;
}
