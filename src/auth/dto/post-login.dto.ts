// import { ApiProperty } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class PostLoginDto {
  @ApiProperty({
    description: 'Email sent by a user.',
  })
  @IsNotEmpty()
  @Type(() => String)
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Password sent by a user.',
  })
  @IsNotEmpty()
  @Type(() => String)
  @IsString()
  password: string;
}
