import { DiscordService } from './discord.service';
import { environment } from 'src/environment';
import { Body, Controller, Get, Patch, Put, Post } from '@nestjs/common';
import { ConfigData } from './ConfigData';

@Controller('discord')
export class DiscordController {

    constructor(private discordService: DiscordService) {}

    @Get()
    public getLogin() {
        return `https://discord.com/api/oauth2/authorize?client_id=${environment.discordClientID}&permissions=0&scope=bot%20applications.commands`;
    }

    @Post()
    public botIngress(@Body() data: ConfigData) {
        
    }

}
