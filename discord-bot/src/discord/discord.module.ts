import { StorageModule } from './../storage/storage.module';
import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { DiscordController } from './discord.controller';

@Module({
  imports: [StorageModule],
  providers: [DiscordService],
  controllers: [DiscordController]
})
export class DiscordModule {
  
}
