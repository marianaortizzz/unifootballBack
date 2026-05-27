import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Standing } from './entities/standing.entity'
import { PlayerStats } from './entities/player-stats.entity'
import { StatsController } from './stats.controller'
import { StatsService } from './stats.service'

@Module({
  imports: [TypeOrmModule.forFeature([Standing, PlayerStats])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}