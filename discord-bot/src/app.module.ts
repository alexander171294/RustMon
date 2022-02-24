import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscordModule } from './discord/discord.module';
import environment from './environment';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    DiscordModule,
    ConfigModule.forRoot({isGlobal: true, load: [environment]}),
    StorageModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
