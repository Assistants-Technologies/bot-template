import type { CommandInteraction, Interaction, Message } from "discord.js";
import { IntentsBitField } from "discord.js";
import { Client } from "discordx";
import { errorHandler } from "./utils/errorHandler.js";

export const bot = new Client({
  // To use only guild command
  botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],

  // Discord intents
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.MessageContent,
  ],

  // Debug logs are disabled in silent mode
  silent: true,

  // Configuration for @SimpleCommand
  simpleCommand: {
    prefix: "!",
  },
});

bot.once("ready", async () => {
  // Make sure all guilds are cached
  // await bot.guilds.fetch();

  // Synchronize applications commands with Discord
  void bot.initApplicationCommands();

  // To clear all guild commands, uncomment this line,
  // This is useful when moving from guild commands to global commands
  // It must only be executed once
  //
  //  await bot.clearApplicationCommands(
  //    ...bot.guilds.cache.map((g) => g.id)
  //  );

  console.log("Bot started");
});

bot.on("interactionCreate", async (interaction: Interaction) => {
  try {
    await bot.executeInteraction(interaction);
  } catch (error) {
    await errorHandler.handleError(error as Error, interaction as CommandInteraction, {
      command: "interaction",
      userId: interaction.user?.id,
      guildId: interaction.guildId || undefined,
      channelId: interaction.channelId,
    });
  }
});

bot.on("messageCreate", async (message: Message) => {
  try {
    await bot.executeCommand(message);
  } catch (error) {
    const guildId = message.guildId !== null ? message.guildId : undefined;
    await errorHandler.handleError(error as Error, undefined, {
      command: "message",
      userId: message.author.id,
      guildId: guildId as string | undefined,
      channelId: message.channelId,
    });
  }
});
