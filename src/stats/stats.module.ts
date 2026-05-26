import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import {
  MatchEvent,
  MatchEventSchema,
} from '../mongo/schemas/match-event.schema';
import { PlayerStats } from './entities/player-stats.entity';
import { Standing } from './entities/standing.entity';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlayerStats, Standing]),
    MongooseModule.forFeature([
      { name: MatchEvent.name, schema: MatchEventSchema },
    ]),
    AuthModule,
  ],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
