import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DiscordModule } from './discord/discord.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    DiscordModule,
    ConfigModule.forRoot(),
    StorageModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
