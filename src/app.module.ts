import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './auth/entity/user.entity';
import { AuthModule } from './auth/auth.module';
import { ArtworkEntity } from './auth/entity/artwork.entity';
import { ArtworkModule } from './artwork/artwork.module';
import { ArtworkController } from './artwork/controller/artwork.controller';
import { ArtworkService } from './artwork/service/artwork.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ArtworkEntity]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'myuser',
      password: 'password',
      database: 'icfdb',
      entities: [UserEntity, ArtworkEntity],
      synchronize: true,
      autoLoadEntities: true,
    }),
    HttpModule,
    AuthModule,
    ArtworkModule,
  ],
  controllers: [ArtworkController],
  providers: [ArtworkService],
})
export class AppModule {}
