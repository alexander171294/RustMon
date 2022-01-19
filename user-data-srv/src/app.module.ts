import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ValveApiService } from './valve/valve-api.service';
import { IPGeocodeService } from './ipGeocode/ipgeocode.service';
import { HttpModule } from '@nestjs/axios';
import { CacheRedisService } from './redis/redis.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [ValveApiService, IPGeocodeService, CacheRedisService],
})
export class AppModule {}
