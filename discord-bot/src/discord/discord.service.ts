import { StorageService } from './../storage/storage.service';
import { DiscordGuild } from './DIscordGuild';
import { Observable } from 'rxjs';
import { DiscordUser } from './DiscordUser';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from "axios";
import { Client, Intents, Interaction, MessageActionRow, MessageButton } from 'discord.js';
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

@Injectable()
export class DiscordService {

    private readonly logger = new Logger(DiscordService.name);

    private client;
    private rest;

    private readonly commands = [{
        name: 'ping',
        description: 'Replies with Pong!'
    }, {
        name: 'steamconnect',
        description: 'Create steam login button to sync accounts.'
    }];

    constructor(private configService: ConfigService, private httpService: HttpService, private storageSrv: StorageService) {
        this.logger.debug('Discord starting with token' + this.configService.get('discordToken'));
        this.rest = new REST({ version: '9' }).setToken(this.configService.get('discordToken'));
        this.client = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                // Intents.FLAGS.GUILD_MESSAGES,
                // Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            ],
            // partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
        });
        this.client.on('ready', () => {
            this.logger.debug(`Logged in as ${this.client.user.tag}!`);
        });
        this.client.on('interactionCreate', (interaction) => { this.onInteraction(interaction) });
        this.client.on('messageReactionAdd', (reaction, usr) => { this.messageReaction(reaction, usr) });
        this.client.on('guildCreate', (guild) => {
            this.logger.debug(`New guild: ${guild.id}-${guild.name}`);
            const { id, name, icon } = guild;
            this.rest.put(
                Routes.applicationGuildCommands(this.configService.get('discordClientID'), id),
                { body: this.commands },
            );
            this.storageSrv.get(`g/${id}`, true).then(d => {
                if (d) {
                    d.confirmed = true;
                    d.name = name;
                    d.icon = icon;
                    this.storageSrv.put(`g/${id}`, d);
                }
            });
        })
        this.client.login(this.configService.get('discordToken'));
    }

    private async onInteraction(interaction) {

        if (interaction.commandName === 'ping') {
            await interaction.reply('Pong!');
            return;
        }

        if (interaction.commandName === 'steamconnect') {
            const buttonId = `g-${interaction.guildId}`;
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(buttonId)
                        .setLabel('Identificarme')
                        .setStyle('PRIMARY'),
                );
            await interaction.reply({ content: 'Presiona el botón para obtener tu rango', components: [row] });
            return;
        }


        if (interaction.isButton()) {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setURL(`http://localhost:4200`)
                        .setLabel('Ir a steam')
                        .setStyle('LINK'),
                );
            await interaction.reply({ content: 'Tendras que acceder con tu cuenta de steam para que los administradores podamos asociar tu nick al del juego, otorgarte vips, y otras cosas', ephemeral: true, components: [row] });
        }
    }

    private async messageReaction(reaction, usr) {
        // response on reaction
    }

    public getDiscordData(authToken: string): Observable<AxiosResponse<DiscordUser>> {
        return this.httpService.get('https://discord.com/api/users/@me', { headers: { Authorization: `Bearer ${authToken}` } });
    }

    public getGuildData(authToken: string): Observable<AxiosResponse<DiscordGuild[]>> {
        return this.httpService.get('https://discord.com/api/users/@me/guilds', { headers: { Authorization: `Bearer ${authToken}` } });
    }

}
