import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { GraphService } from './graph.service'

@ApiTags('graph')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('graph')
export class GraphController {
  constructor(private readonly service: GraphService) {}

  @Post('sync')
  sync(@Body() body: any) {
    return this.service.syncMatch(body)
  }

  @Get('teams/:teamId/opponents')
  getOpponents(@Param('teamId') teamId: string) {
    return this.service.getOpponents(teamId)
  }

  @Get('teams/:teamId/players')
  getPlayers(@Param('teamId') teamId: string) {
    return this.service.getPlayersByTeam(teamId)
  }

  @Get('teams/:teamId/tournaments')
  getTournaments(@Param('teamId') teamId: string) {
    return this.service.getTournamentsByTeam(teamId)
  }
}