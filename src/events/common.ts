import type { ArgsOf } from 'discordx';
import { Discord, On, Once } from 'discordx';
import { bot } from '../bot.js';
import { errorHandler } from '../utils/errorHandler';
import { CommandInteraction } from 'discord.js';

@Discord()
export class Example {
  @On()
  messageCreate([message]: ArgsOf<'messageCreate'>): void {
    console.log(message.author.username, 'said:', message.content);
  }
}
