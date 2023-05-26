import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/constants';
import { ArtworkService } from 'src/artwork/service/artwork.service';
import { ArtworkController } from 'src/artwork/controller/artwork.controller';
import { ArtworkEntity } from './entity/artwork.entity';
import { HttpModule } from '@nestjs/axios';
import { ArtworkModule } from 'src/artwork/artwork.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ArtworkEntity]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30m' },
    }),
    HttpModule,
    ArtworkModule,
    PassportModule,
  ],
  providers: [AuthService, ArtworkService, LocalStrategy],
  controllers: [AuthController, ArtworkController],
})
export class AuthModule {}
