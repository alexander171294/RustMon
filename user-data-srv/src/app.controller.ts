import { Controller, Get, HttpException, HttpStatus, Logger, Query, Response } from '@nestjs/common';
import { IPApiData, IPGeocodeService } from './ipGeocode/ipgeocode.service';
import { SteamVisibleStates, UserDataDTO } from './UserDataDTO';
import { PlayerDataResponse, PlayerVacsResponse, ValveApiService } from './valve/valve-api.service';
import { AxiosResponse } from 'axios';
import { CacheRedisService } from './redis/redis.service';
import { environment } from './environment';
import { Response as Res } from 'express';

@Controller()
export class AppController {

  private readonly logger = new Logger(AppController.name);

  constructor(private valveApi: ValveApiService, private geocode: IPGeocodeService, private redis: CacheRedisService) {}

  @Get('udata')
  async getUserData(@Query('steamID') steamID: string, @Query('ip') ip: string, @Response() res: Res) {
    if(!steamID) {
      throw new HttpException('steamID required param', HttpStatus.BAD_REQUEST);
    }
    const udata: UserDataDTO = await this.redis.getFromCache(steamID, true);
    if(udata) {
      res.set({ 'x-cached': 'Yes' }).json(udata);
      return;
    }
    const result = new UserDataDTO();
    this.valveApi.getUserData(steamID).subscribe((d: AxiosResponse<PlayerDataResponse>) => {
      if(d.data.response.players.length == 0) {
        throw new HttpException('SteamID not found', HttpStatus.NOT_FOUND);
      }
      result.userData = d.data.response.players[0];
      this.valveApi.getVacs(steamID).subscribe((d: AxiosResponse<PlayerVacsResponse>) => {
        result.vacData = d.data.players[0];
        if((result.userData.communityvisibilitystate != SteamVisibleStates.PUBLIC || !result.userData.loccountrycode) && ip) {
          this.geocode.getIpApi(ip).subscribe((d: AxiosResponse<IPApiData>) => {
            result.countryCode = d.data.countryCode;
            this.saveInCache(steamID, result);
            res.set({ 'x-cached': 'No', 'x-geo': 'Yes' }).json(udata);
          }, e => {
            this.logger.error("Error getting geoip", e);
            this.saveInCache(steamID, result);
            res.set({ 'x-cached': 'No', 'x-geo': 'Err' }).json(udata);
          })
        } else {
          result.countryCode = result.userData.loccountrycode;
          this.saveInCache(steamID, result);
          res.set({ 'x-cached': 'No', 'x-geo': 'No' }).json(udata);
        }
      }, e => {
        this.logger.error("Error getting vac", e)
        throw new HttpException('Error getting vac', HttpStatus.BAD_GATEWAY);
      });
    }, e => {
      this.logger.error("Error getting userdata", e)
      throw new HttpException('Error getting user data', HttpStatus.BAD_GATEWAY);
    });
  }

  private saveInCache(id64: string, result: UserDataDTO) {
    this.redis.saveInCache(id64, environment.secondsCacheUsers, result);
  }
}
