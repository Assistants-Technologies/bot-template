import { dirname, importx } from "@discordx/importer";
import { config } from "dotenv";

import { bot } from "./bot.js";
import { setupGlobalErrorHandlers, errorHandler } from "./utils/errorHandler.js";

// Load environment variables from .env file
config();

async function run() {
  // Setup global error handlers
  setupGlobalErrorHandlers();

  // The following syntax should be used in the commonjs environment
  //
  // await importx(__dirname + "/{events,commands}/**/*.{ts,js}");

  // The following syntax should be used in the ECMAScript environment
  await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

  // Let's start the bot
  if (!process.env.DISCORD_TOKEN) {
    throw Error("Could not find DISCORD_TOKEN in your environment");
  }

  // Log in with your bot token
  await bot.login(process.env.DISCORD_TOKEN);
  
  // Set the client for error reporting
  errorHandler.setClient(bot);
}

void run();
