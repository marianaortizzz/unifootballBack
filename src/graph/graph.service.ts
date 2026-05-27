import { Inject, Injectable } from '@nestjs/common'
import { Driver, Session } from 'neo4j-driver'
import { NEO4J_DRIVER } from './graph.constants'

@Injectable()
export class GraphService {
  constructor(@Inject(NEO4J_DRIVER) private readonly driver: Driver) {}

  private session(): Session {
    return this.driver.session()
  }

  // Sincroniza nodos Player, Team, Tournament y sus relaciones
  async syncMatch(data: {
    tournamentId: string
    tournamentName: string
    homeTeamId: string
    homeTeamName: string
    awayTeamId: string
    awayTeamName: string
    playerIds: string[]
    playerNames: Record<string, string>
  }) {
    const session = this.session()
    try {
      await session.run(
        `
        MERGE (t:Tournament {id: $tournamentId})
          ON CREATE SET t.name = $tournamentName

        MERGE (home:Team {id: $homeTeamId})
          ON CREATE SET home.name = $homeTeamName
        MERGE (away:Team {id: $awayTeamId})
          ON CREATE SET away.name = $awayTeamName

        MERGE (home)-[:BELONGS_TO]->(t)
        MERGE (away)-[:BELONGS_TO]->(t)
        MERGE (home)-[:FACED {tournamentId: $tournamentId}]->(away)
        `,
        data,
      )

      for (const playerId of data.playerIds) {
        await session.run(
          `
          MERGE (p:Player {id: $playerId})
            ON CREATE SET p.name = $playerName
          MERGE (home:Team {id: $homeTeamId})
          MERGE (away:Team {id: $awayTeamId})
          MERGE (p)-[:PLAYED_WITH]->(home)
          MERGE (p)-[:PLAYED_WITH]->(away)
          `,
          {
            playerId,
            playerName: data.playerNames[playerId] ?? 'Unknown',
            homeTeamId: data.homeTeamId,
            awayTeamId: data.awayTeamId,
          },
        )
      }
    } finally {
      await session.close()
    }
  }

  // Query 1: equipos que han enfrentado a un equipo dado
  async getOpponents(teamId: string) {
    const session = this.session()
    try {
      const result = await session.run(
        `
        MATCH (t:Team {id: $teamId})-[:FACED]-(opponent:Team)
        RETURN opponent.id AS id, opponent.name AS name
        `,
        { teamId },
      )
      return result.records.map(r => ({ id: r.get('id'), name: r.get('name') }))
    } finally {
      await session.close()
    }
  }

  // Query 2: jugadores que han jugado con un equipo dado
  async getPlayersByTeam(teamId: string) {
    const session = this.session()
    try {
      const result = await session.run(
        `
        MATCH (p:Player)-[:PLAYED_WITH]->(t:Team {id: $teamId})
        RETURN p.id AS id, p.name AS name
        `,
        { teamId },
      )
      return result.records.map(r => ({ id: r.get('id'), name: r.get('name') }))
    } finally {
      await session.close()
    }
  }

  // Query 3: torneos en los que participó un equipo
  async getTournamentsByTeam(teamId: string) {
    const session = this.session()
    try {
      const result = await session.run(
        `
        MATCH (t:Team {id: $teamId})-[:BELONGS_TO]->(tournament:Tournament)
        RETURN tournament.id AS id, tournament.name AS name
        `,
        { teamId },
      )
      return result.records.map(r => ({ id: r.get('id'), name: r.get('name') }))
    } finally {
      await session.close()
    }
  }
}