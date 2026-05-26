import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatchEvent } from '../mongo/schemas/match-event.schema';
import { CreateMatchEventDto } from './dto/create-match-event.dto';
import { PlayerStatsTotalsDto } from './dto/player-stats-totals.dto';
import { Standing } from './entities/standing.entity';
import { StatsService } from './stats.service';

@ApiTags('stats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stats')
export class StatsController {
  constructor(private readonly service: StatsService) {}

  @Get('players/:playerId')
  @ApiOperation({ summary: 'Estadísticas totales de un jugador' })
  getPlayerTotals(
    @Param('playerId', ParseUUIDPipe) playerId: string,
  ): Promise<PlayerStatsTotalsDto> {
    return this.service.getPlayerTotals(playerId);
  }

  @Get('standings/:tournamentId')
  @ApiOperation({ summary: 'Tabla de posiciones de un torneo' })
  getStandings(
    @Param('tournamentId', ParseUUIDPipe) tournamentId: string,
  ): Promise<Standing[]> {
    return this.service.getStandings(tournamentId);
  }

  @Post('match-events')
  @ApiOperation({ summary: 'Registrar evento en vivo de un partido' })
  createMatchEvent(@Body() dto: CreateMatchEventDto): Promise<MatchEvent> {
    return this.service.createMatchEvent(dto);
  }

  @Get('match-events/:matchId')
  @ApiOperation({ summary: 'Timeline de eventos de un partido' })
  getMatchEvents(
    @Param('matchId', ParseUUIDPipe) matchId: string,
  ): Promise<MatchEvent[]> {
    return this.service.getMatchEvents(matchId);
  }
}
