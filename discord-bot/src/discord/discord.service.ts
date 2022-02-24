import { DiscordGuild } from './DIscordGuild';
import { Observable } from 'rxjs';
import { DiscordUser } from './DiscordUser';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from "axios";
const { Client, Intents } = require('discord.js');

@Injectable()
export class DiscordService {

    private readonly logger = new Logger(DiscordService.name);

    private client;

    constructor(private configService: ConfigService, private httpService: HttpService) {
        this.client = new Client({ intents: [Intents.FLAGS.GUILDS] });
        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}!`);
        });
        this.client.on('interactionCreate', (interaction) => { this.onInteraction(interaction) });
        this.logger.debug('Discord starting with token' + this.configService.get('discordToken'));
        this.client.login(this.configService.get('discordToken'));
    }

    private async onInteraction(interaction) {
        if (!interaction.isCommand()) return;

        if (interaction.commandName === 'ping') {
            await interaction.reply('Pong!');
        }
    }

    public getDiscordData(authToken: string): Observable<AxiosResponse<DiscordUser>> {
        return this.httpService.get('https://discord.com/api/users/@me', { headers: {Authorization: `Bearer ${authToken}`}});
    }

    public getGuildData(authToken: string): Observable<AxiosResponse<DiscordGuild[]>> {
        return this.httpService.get('https://discord.com/api/users/@me/guilds', { headers: {Authorization: `Bearer ${authToken}`}});
    }

}
