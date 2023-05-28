import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ArtWorkIdParamDto {
  @ApiProperty({
    description: 'The id of the artwork you want to access',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  artworkId: number;
}
