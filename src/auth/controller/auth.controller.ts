import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  NotFoundException,
  Get,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { PostLoginDto } from '../dto/post-login.dto';
import { ResponseLoginJwtDto } from '../dto/response-login-jwt.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Log in with your user credentials.',
  })
  @ApiResponse({
    status: 200,
    description: 'Response will contain a jwt token and a user object',
    type: ResponseLoginJwtDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Wrong username or password specified.',
    type: NotFoundException,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async signIn(
    @Body() getLoginJwtDto: PostLoginDto,
  ): Promise<ResponseLoginJwtDto> {
    return await this.authService.signIn(getLoginJwtDto);
  }

  @ApiOperation({
    summary:
      'It"s pretty painful to set up a seeding in nestjs, so BEHOLD the mighty seed endpoint ',
  })
  @Get('/seed')
  async seed() {
    return await this.authService.seed();
  }
}
