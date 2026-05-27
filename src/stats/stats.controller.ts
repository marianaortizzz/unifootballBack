import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { StatsService } from './stats.service'

@ApiTags('stats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class StatsController {
  constructor(private readonly service: StatsService) {}

  @Get('standings')
  getStandings(@Query('tournament_id') tournamentId: string) {
    return this.service.findStandings(tournamentId)
  }

  @Get('players-stats/match/:matchId')
  getStatsByMatch(@Param('matchId') matchId: string) {
    return this.service.findPlayerStatsByMatch(matchId)
  }

  @Get('players-stats/user/:userId')
  getStatsByUser(@Param('userId') userId: string) {
    return this.service.findPlayerStatsByUser(userId)
  }
}