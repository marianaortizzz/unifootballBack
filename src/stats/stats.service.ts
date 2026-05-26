import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { Repository } from 'typeorm';
import {
  MatchEvent,
  MatchEventDocument,
} from '../mongo/schemas/match-event.schema';
import { CreateMatchEventDto } from './dto/create-match-event.dto';
import { PlayerStatsTotalsDto } from './dto/player-stats-totals.dto';
import { PlayerStats } from './entities/player-stats.entity';
import { Standing } from './entities/standing.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(PlayerStats)
    private readonly playerStatsRepo: Repository<PlayerStats>,
    @InjectRepository(Standing)
    private readonly standingRepo: Repository<Standing>,
    @InjectModel(MatchEvent.name)
    private readonly matchEventModel: Model<MatchEventDocument>,
  ) {}

  async getPlayerTotals(playerId: string): Promise<PlayerStatsTotalsDto> {
    const rows = await this.playerStatsRepo.find({ where: { userId: playerId } });

    const totals = rows.reduce(
      (acc, row) => {
        acc.goals += row.goals;
        acc.assists += row.assists;
        acc.yellowCards += row.yellowCards;
        acc.redCards += row.redCards;
        acc.minutesPlayed += row.minutesPlayed;
        return acc;
      },
      {
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        minutesPlayed: 0,
      },
    );

    return {
      playerId,
      matchesPlayed: rows.length,
      ...totals,
    };
  }

  getStandings(tournamentId: string): Promise<Standing[]> {
    return this.standingRepo.find({
      where: { tournamentId },
      relations: { team: true },
      order: { points: 'DESC', goalsFor: 'DESC' },
    });
  }

  async createMatchEvent(dto: CreateMatchEventDto): Promise<MatchEvent> {
    const created = await this.matchEventModel.create({
      matchId: dto.matchId,
      type: dto.type,
      minute: dto.minute,
      playerId: dto.playerId,
      teamId: dto.teamId,
      description: dto.description ?? null,
      createdAt: new Date(),
    });
    return created.toObject();
  }

  getMatchEvents(matchId: string): Promise<MatchEvent[]> {
    return this.matchEventModel
      .find({ matchId })
      .sort({ minute: 1, createdAt: 1 })
      .lean()
      .exec();
  }
}
