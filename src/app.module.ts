import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MatchesModule } from './matches/matches.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { StatsModule } from './stats/stats.module';
import { GraphModule } from './graph/graph.module';
import { NotificationsModule } from './notifications/notifications.module';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // solo para desarrollo
        ssl: { rejectUnauthorized: false }, // requerido por Supabase
      }),
    }),
    AuthModule,
    TournamentsModule,
    MatchesModule,
    StatsModule,
    GraphModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
