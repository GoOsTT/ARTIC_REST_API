import { Module } from '@nestjs/common';
import { ArtworkController } from './controller/artwork.controller';
import { ArtworkService } from './service/artwork.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ArtworkController],
  providers: [ArtworkService],
})
export class ArtworkModule {}
