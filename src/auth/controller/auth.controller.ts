import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { PostLoginDto } from '../dto/post-login.dto';
import { ResponseLoginJwtDto } from '../dto/response-login-jwt.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  signIn(@Body() getLoginJwtDto: PostLoginDto): Promise<ResponseLoginJwtDto> {
    return this.authService.signIn(getLoginJwtDto);
  }
}
