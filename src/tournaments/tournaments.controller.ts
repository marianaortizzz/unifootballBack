import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { AddTeamToTournamentDto } from './dto/add-team-to-tournament.dto';
import { CreateStageDto } from './dto/create-stage.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { Stage } from './entities/stage.entity';
import { TeamMember } from './entities/team-member.entity';
import { Team } from './entities/team.entity';
import { TournamentTeam } from './entities/tournament-team.entity';
import { Tournament } from './entities/tournament.entity';
import { TournamentsService } from './tournaments.service';

@ApiTags('tournaments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class TournamentsController {
  constructor(private readonly service: TournamentsService) {}

  // ---------- Tournaments ----------

  @Get('tournaments')
  @ApiOperation({ summary: 'Listar todos los torneos' })
  findAllTournaments(): Promise<Tournament[]> {
    return this.service.findAllTournaments();
  }

  @Get('tournaments/:id')
  @ApiOperation({ summary: 'Obtener un torneo por id' })
  findTournament(@Param('id', ParseUUIDPipe) id: string): Promise<Tournament> {
    return this.service.findTournament(id);
  }

  @Post('tournaments')
  @ApiOperation({ summary: 'Crear un torneo' })
  createTournament(@Body() dto: CreateTournamentDto): Promise<Tournament> {
    return this.service.createTournament(dto);
  }

  @Patch('tournaments/:id')
  @ApiOperation({ summary: 'Actualizar un torneo' })
  updateTournament(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTournamentDto,
  ): Promise<Tournament> {
    return this.service.updateTournament(id, dto);
  }

  @Post('tournaments/:id/teams')
  @ApiOperation({ summary: 'Inscribir un equipo al torneo' })
  addTeamToTournament(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddTeamToTournamentDto,
  ): Promise<TournamentTeam> {
    return this.service.addTeamToTournament(id, dto);
  }

  // ---------- Stages ----------

  @Get('tournaments/:id/stages')
  @ApiOperation({ summary: 'Listar fases de un torneo' })
  findStages(@Param('id', ParseUUIDPipe) id: string): Promise<Stage[]> {
    return this.service.findStages(id);
  }

  @Post('tournaments/:id/stages')
  @ApiOperation({ summary: 'Crear una fase del torneo' })
  createStage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateStageDto,
  ): Promise<Stage> {
    return this.service.createStage(id, dto);
  }

  // ---------- Teams ----------

  @Get('teams')
  @ApiOperation({ summary: 'Listar todos los equipos' })
  findAllTeams(): Promise<Team[]> {
    return this.service.findAllTeams();
  }

  @Get('teams/:id')
  @ApiOperation({ summary: 'Obtener un equipo por id' })
  findTeam(@Param('id', ParseUUIDPipe) id: string): Promise<Team> {
    return this.service.findTeam(id);
  }

  @Post('teams')
  @ApiOperation({ summary: 'Crear un equipo' })
  createTeam(@Body() dto: CreateTeamDto): Promise<Team> {
    return this.service.createTeam(dto);
  }

  @Post('teams/:id/members')
  @ApiOperation({ summary: 'Agregar un jugador al equipo' })
  addTeamMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddTeamMemberDto,
  ): Promise<TeamMember> {
    return this.service.addTeamMember(id, dto);
  }
}
