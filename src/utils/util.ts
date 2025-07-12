import { type Message } from 'discord.js';
import type { Client } from 'discordx';

/**
 * Capitalises the first letter of each word in a string.
 * @param str - The string to be capitalised.
 * @returns The capitalised string.
 */
export const capitalise = (str: string): string => str.replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Deletes a message after a specified delay if it's deletable.
 * @param message - The message to delete.
 * @param time - The delay before deletion, in milliseconds.
 */
export function deletableCheck(message: Message, time: number): void {
    setTimeout(() => {
        message.delete().catch((error) => console.error('Error deleting message:', error));
    }, time);
}

export async function getCommandIds(client: Client): Promise<Record<string, string>> {
    if (!client.application) {
        throw new Error('Client application is not available');
    }

    const commandIds = new Map<string, string>();
    const isGuildOnly = client.botGuilds && client.botGuilds.length > 0;

    // Fetch global commands
    if (!isGuildOnly) {
        try {
            const globalCommands = await client.application.commands.fetch();
            for (const cmd of globalCommands.values()) {
                console.log(cmd.name, cmd.id);
                commandIds.set(cmd.name, cmd.id);
            }
        } catch (error) {
            console.warn('Could not fetch global commands:', error);
        }
    }

    // Fetch guild commands
    const guildPromises = Array.from(client.guilds.cache.values()).map(async (guild) => {
        try {
            const guildCommands = await guild.commands.fetch();
            for (const cmd of guildCommands.values()) {
                console.log(cmd.name, cmd.id);
                commandIds.set(cmd.name, cmd.id);
            }
        } catch (error) {
            console.warn(`Could not fetch commands for guild ${guild.name}:`, error);
        }
    });

    await Promise.allSettled(guildPromises);

    return Object.fromEntries(commandIds);
}