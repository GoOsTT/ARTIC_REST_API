import {
  Injectable,
  UnauthorizedException,
  ImATeapotException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { PostLoginDto } from '../dto/post-login.dto';
import { ResponseLoginJwtDto } from '../dto/response-login-jwt.dto';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '../enums/UserType.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return {
      jwt: await this.jwtService.signAsync(payload),
      user: userWithoutPassword,
    };
  }

  async seed() {
    // Create two user instances
    const user1 = new UserEntity();
    user1.email = 'user1@email.com';
    user1.password = 'password';
    user1.canPurchase = UserType.CANNOT_BUY;

    const user2 = new UserEntity();
    user2.email = 'user2@email.com';
    user2.password = 'password';
    user2.canPurchase = UserType.CAN_BUY;

    // Save the user instances to the database
    try {
      await this.userRepository.save([user1, user2]);
    } catch (error) {
      throw new ImATeapotException(
        "I bet you haven't seen me anywhere, have you?",
      );
    }
  }
}
