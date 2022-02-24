import { Injectable } from '@nestjs/common';
const { Client, Intents } = require('discord.js');

@Injectable()
export class DiscordService {

    private client;

    constructor() {
        this.client = new Client({ intents: [Intents.FLAGS.GUILDS] });
        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}!`);
        });
        this.client.on('interactionCreate', (interaction) => { this.onInteraction(interaction) });
        this.client.login();
    }

    private async onInteraction(interaction) {
        if (!interaction.isCommand()) return;

        if (interaction.commandName === 'ping') {
            await interaction.reply('Pong!');
        }
    }

    public validateCode(code: string) {
        // /users/@me
    }

}
