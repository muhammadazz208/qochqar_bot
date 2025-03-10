import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './modules/bot/bot.module';

@Module({
  imports: [
    BotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
