import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { PostLoginDto } from '../dto/post-login.dto';
import { ResponseLoginJwtDto } from '../dto/response-login-jwt.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async signIn(getLoginJwtDto: PostLoginDto): Promise<ResponseLoginJwtDto> {
    const { email, password } = getLoginJwtDto;

    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Wrong username or password specified.');
    }

    const payload = { sub: user.id, username: user.email };
    const { password: _, ...userWithoutPassword } = user;

    return {
      jwt: await this.jwtService.signAsync(payload),
      user: userWithoutPassword,
    };
  }
}
