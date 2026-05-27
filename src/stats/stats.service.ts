import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Standing } from './entities/standing.entity'
import { PlayerStats } from './entities/player-stats.entity'

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Standing)
    private standingsRepo: Repository<Standing>,
    @InjectRepository(PlayerStats)
    private playerStatsRepo: Repository<PlayerStats>,
  ) {}

  findStandings(tournamentId: string): Promise<Standing[]> {
    return this.standingsRepo.find({
      where: { tournamentId },
      relations: { team: true },
      order: { points: 'DESC' },
    })
  }

  findPlayerStatsByMatch(matchId: string): Promise<PlayerStats[]> {
    return this.playerStatsRepo.find({
      where: { matchId },
      relations: { user: true },
    })
  }

  findPlayerStatsByUser(userId: string): Promise<PlayerStats[]> {
    return this.playerStatsRepo.find({
      where: { userId },
      relations: { match: true },
    })
  }
}