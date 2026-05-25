import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMatchDto } from './dto/create-match.dto';
import { ListMatchesQueryDto } from './dto/list-matches.dto';
import { UpdateMatchResultDto } from './dto/update-match-result.dto';
import { MatchResult } from './entities/match-result.entity';
import { Match } from './entities/match.entity';
import { MatchesService } from './matches.service';

@ApiTags('matches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('matches')
export class MatchesController {
  constructor(private readonly service: MatchesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un partido' })
  create(@Body() dto: CreateMatchDto): Promise<Match> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar partidos (opcionalmente filtrados por torneo)' })
  findAll(@Query() query: ListMatchesQueryDto): Promise<Match[]> {
    return this.service.findAll(query.tournament_id);
  }

  @Patch(':id/result')
  @ApiOperation({ summary: 'Registrar / actualizar el resultado de un partido' })
  updateResult(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMatchResultDto,
  ): Promise<MatchResult> {
    return this.service.updateResult(id, dto);
  }
}
