import { Module } from '@nestjs/common';
import { ArtworkController } from './controller/artwork.controller';
import { ArtworkService } from './service/artwork.service';
import { HttpModule } from '@nestjs/axios';
import { ArtworkEntity } from '../auth/entity/artwork.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/auth/entity/user.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([UserEntity, ArtworkEntity])],
  controllers: [ArtworkController],
  providers: [ArtworkService, ArtworkEntity],
})
export class ArtworkModule {}
