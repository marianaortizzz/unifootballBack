import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as neo4j from 'neo4j-driver'
import { NEO4J_DRIVER } from './graph.constants'
import { GraphService } from './graph.service'
import { GraphController } from './graph.controller'

@Module({
  imports: [ConfigModule],
  controllers: [GraphController],
  providers: [
    {
      provide: NEO4J_DRIVER,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        neo4j.driver(
          config.get<string>('NEO4J_URI')!,
          neo4j.auth.basic(
            config.get<string>('NEO4J_USER')!,
            config.get<string>('NEO4J_PASSWORD')!,
          ),
        ),
    },
    GraphService,
  ],
  exports: [GraphService],
})
export class GraphModule {}