// import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserEntity } from '../entity/user.entity';

export class ResponseLoginJwtDto {
  //   @ApiProperty({
  //     description: 'JWT Returned to the user.',
  //   })
  @IsNotEmpty()
  @Type(() => String)
  @IsString()
  jwt: string;

  //   @ApiProperty({
  //     description: 'Object containing information about the user.',
  //   })
  @IsNotEmpty()
  user: UserEntity;
}
