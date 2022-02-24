import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DiscordModule } from './discord/discord.module';

@Module({
  imports: [
    DiscordModule,
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
