import { ConfigService } from '@nestjs/config';
import { DiscordService } from './discord.service';
import { Body, Controller, Get, Post, Query, Logger, Delete } from '@nestjs/common';
import { ConfigData } from './ConfigData';
import { StorageService } from 'src/storage/storage.service';

@Controller('discord')
export class DiscordController {

    private readonly logger = new Logger(DiscordController.name);

    constructor(private discordService: DiscordService, private configSrv: ConfigService, private storage: StorageService) {}

    @Get()
    public getLogin(@Query('state') state: string, @Query('accessToken') accessToken?: string) {
        return new Promise((res, rej) => {
            if(!accessToken) {
                res(`https://discord.com/api/oauth2/authorize?response_type=token&client_id=${this.configSrv.get('discordClientID')}&state=${state}&scope=identify%20guilds&redirect_uri=${this.configSrv.get('redirectURI')}`);
                return;
            }
            this.discordService.getDiscordData(accessToken).subscribe(d => {
                const user = d.data;
                const userName = `u/${user.username}#${user.discriminator}`;
                this.storage.get(userName, true).then(r => {
                    if(!r) {
                        this.discordService.getGuildData(accessToken).subscribe(d2 => {
                            res({
                                notDefined: true,
                                admin: `${d.data.username}#${d.data.discriminator}`,
                                servers: d2.data.filter(d2=> d2.owner)
                            });
                        });
                    } else {
                        res(r);
                    }
                });
            });
        });
    }

    @Delete()
    public botDeleteDefinition(@Query('accessToken') accessToken: string) {
        return new Promise((res, rej) => {
            if(accessToken) {
                this.discordService.getDiscordData(accessToken).subscribe(d => {
                    const user = d.data;
                    const userName = `u/${user.username}#${user.discriminator}`;
                    this.storage.del(userName);
                    res('{}');
                });
            }
        });
    }

    @Post()
    public botDefine(@Body() data: ConfigData) {
        return new Promise((res, rej) => {
            this.discordService.getDiscordData(data.accessToken).subscribe(d => {
                const user = d.data;
                const userName = `u/${user.username}#${user.discriminator}`;
                this.logger.debug('Discord response for ' + userName);
                const glbData = {
                    notDefined: false,
                    admin: userName,
                    adminDiscriminator: user.discriminator,
                    adminName: user.username,
                    discordID: data.discordID,
                    rconHost: data.server,
                    rconPass: data.password,
                    rconPort: data.port,
                    invitation: `https://discord.com/api/oauth2/authorize?client_id=${this.configSrv.get('discordClientID')}&permissions=0&scope=bot%20applications.commands`
                };
                this.storage.put(userName, glbData);
                this.storage.put(`g/${data.discordID}`, {confirmed: false, author: userName});
                res(glbData);
            });
        });
    }

}
