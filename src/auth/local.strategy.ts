import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { PostLoginDto } from './dto/post-login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    const getLoginJwtDto: PostLoginDto = {
      email: email,
      password: password,
    };
    const user = await this.authService.signIn(getLoginJwtDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    console.log(user);

    return user;
  }
}
