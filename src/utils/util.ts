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

    try {
        const commands = await client.application.commands.fetch();
        return Object.fromEntries(commands.map((c) => [c.name, c.id]));
    } catch (error) {
        console.error('Error fetching global commands:', error);
        throw error;
    }
}