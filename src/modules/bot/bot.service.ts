import { Injectable } from '@nestjs/common';
import { Bot, Context, InlineKeyboard } from "grammy";
import { ramazonTaqvim } from 'src/databasa/ramadan';

import * as dotenv from 'dotenv';

dotenv.config();
@Injectable()
export class BotService {
  private bot: Bot;

  constructor() {
    if (!process.env.BOT_TOKEN) {
      throw new Error("BOT_TOKEN is missing in .env file");
    }

    this.bot = new Bot(process.env.BOT_TOKEN);

    this.bot.command('start', async (ctx) => {

      await ctx.reply("Hi bro! Wassup? From now on you are a member of 'the Qo'chqar'. Try /help");
    });


    this.bot.command("ramazon_calendar", async (context) => {
      await context.reply("Choose the current day to know Suhoor and Iftar times with duas.");

      const inlineButtons = new InlineKeyboard();

      for (let index = 0; index < ramazonTaqvim.length; index += 3) {
        const first = ramazonTaqvim[index];
        const second = ramazonTaqvim[index + 1];
        const third = ramazonTaqvim[index + 2];

        inlineButtons.text(`📅 ${first.kun}-kun`, `day_${first.kun}`);
        if (second) {
          inlineButtons.text(`📅 ${second.kun}-kun`, `day_${second.kun}`);
        }
        if (third) {
          inlineButtons.text(`📅 ${third.kun}-kun`, `day_${third.kun}`);
        }
        inlineButtons.row();
      }

      await context.reply("Choose a day to see Suhoor and Iftar times with duas.", {
        reply_markup: inlineButtons,
      });
    });

    this.bot.callbackQuery(/day_\d+/, async (ctx) => {
      const ramadan_day = Number(ctx.callbackQuery.data.split('_')[1]);
      const foundDay = ramazonTaqvim.find((day) => day.kun === ramadan_day);

      await ctx.reply(
        `📅 Ramazon oyi – ${foundDay?.kun}-kun\n\n` +
        `🌅 *Saxarlik vaqti:* ${foundDay?.saxarlik}\n` +
        `📖 *Saxarlik duosi:*\n` +
        `${foundDay?.saxarDuaAr}\n` +
        `🔹 *O'qilishi:*\n**${foundDay?.saxarDuaUz}**\n\n` +
        `🌇 *Iftorlik vaqti:* ${foundDay?.iftorlik}\n` +
        `📖 *Iftorlik duosi:*\n` +
        `${foundDay?.iftorDuaAr}\n` +
        `🔹 *O'qilishi:*\n**${foundDay?.iftorDuaUz}**\n\n` +
        `🕌 *Duolarimiz ijobat bo‘lsin!* 🤲`
      );

      await ctx.answerCallbackQuery('☪️');
    });

    this.bot.command("help", async (ctx) => {
      await ctx.reply(
        "Here are the available commands:\n" +
        "/start - Start the bot\n" +
        "/help - Show this help message\n" +
        "/ramazon_calendar - Show ramadan calendar"
      );
    });

    this.bot.api.setMyCommands([
      { command: "start", description: "Start the bot" },
      { command: "help", description: "Show help text" },
      { command: "ramazon_calendar", description: "Show ramadan calendar" },
    ]);

    this.bot.start();
  }
}
