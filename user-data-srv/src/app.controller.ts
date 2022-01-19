import { Controller, Get, HttpException, HttpStatus, Logger, Query } from '@nestjs/common';
import { IPApiData, IPGeocodeService } from './ipGeocode/ipgeocode.service';
import { SteamVisibleStates, UserDataDTO } from './UserDataDTO';
import { PlayerDataResponse, PlayerVacsResponse, ValveApiService } from './valve/valve-api.service';
import { AxiosResponse } from 'axios';
import { CacheRedisService } from './redis/redis.service';
import { environment } from './environment';

@Controller()
export class AppController {

  private readonly logger = new Logger(AppController.name);

  constructor(private valveApi: ValveApiService, private geocode: IPGeocodeService, private redis: CacheRedisService) {}

  @Get('udata')
  async getUserData(@Query('steamID') steamID: string, @Query('ip') ip: string) {
    if(!steamID) {
      throw new HttpException('steamID required param', HttpStatus.BAD_REQUEST);
    }
    const udata: UserDataDTO = await this.redis.getFromCache(steamID, true);
    return new Promise((resolve, reject) => {
      if(udata) {
        resolve(udata);
        return;
      }
      const result = new UserDataDTO();
      this.valveApi.getUserData(steamID).subscribe((d: AxiosResponse<PlayerDataResponse>) => {
        result.userData = d.data.players[0];
        this.valveApi.getVacs(steamID).subscribe((d: AxiosResponse<PlayerVacsResponse>) => {
          result.vacData = d.data.players[0];
          if((result.userData.communityvisibilitystate != SteamVisibleStates.PUBLIC || !result.userData.loccountrycode) && ip) {
            this.geocode.getIpApi(ip).subscribe((d: AxiosResponse<IPApiData>) => {
              result.countryCode = d.data.countryCode;
              this.saveInCache(steamID, result);
              resolve(result);
            }, e => {
              this.logger.error("Error getting geoip", e);
              this.saveInCache(steamID, result);
              resolve(result);
            })
          } else {
            result.countryCode = result.userData.loccountrycode;
            this.saveInCache(steamID, result);
            resolve(result);
          }
        }, e => {
          this.logger.error("Error getting vac", e)
          throw new HttpException('Error getting vac', HttpStatus.BAD_GATEWAY);
        });
      }, e => {
        this.logger.error("Error getting userdata", e)
        throw new HttpException('Error getting user data', HttpStatus.BAD_GATEWAY);
      });
    });
  }

  private saveInCache(id64: string, result: UserDataDTO) {
    this.redis.saveInCache(id64, environment.secondsCacheUsers, result);
  }
}
