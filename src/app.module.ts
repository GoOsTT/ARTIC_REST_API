import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/entity/user.entity';
import { AuthModule } from './auth/auth.module';
import { ArtworkOwnerShip } from './auth/entity/artwork.entity';
import { ArtworkModule } from './artwork/artwork.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'myuser',
      password: 'password',
      database: 'icfdb',
      entities: [User, ArtworkOwnerShip],
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    ArtworkModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
