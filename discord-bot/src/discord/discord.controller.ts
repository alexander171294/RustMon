import { DiscordService } from './discord.service';
import { environment } from 'src/environment';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ConfigData } from './ConfigData';

@Controller('discord')
export class DiscordController {

    constructor(private discordService: DiscordService) {}

    @Get()
    public getLogin(@Query('state') state: string) {
        return `https://discord.com/api/oauth2/authorize?response_type=token&client_id=${environment.discordClientID}&state=${state}&scope=identify&redirect_uri=${environment.redirectURI}`;
    }

    @Get('/invite')
    public getBotInvitation() {
        return `https://discord.com/api/oauth2/authorize?client_id=${environment.discordClientID}&permissions=0&scope=bot%20applications.commands`;
    }

    @Post()
    public botDefine(@Body() data: ConfigData) {

    }

}
