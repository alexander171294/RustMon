import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { DiscordController } from './discord.controller';

@Module({
  providers: [DiscordService],
  controllers: [DiscordController]
})
export class DiscordModule {
  
}
