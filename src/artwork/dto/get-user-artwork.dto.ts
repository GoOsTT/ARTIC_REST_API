import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetUserArtWorkDto {
  @ApiProperty({
    description: 'The id of the user you want to see artwork ownership for.',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  id: number;
}
