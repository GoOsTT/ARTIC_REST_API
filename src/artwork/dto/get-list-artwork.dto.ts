import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetListArtworkDto {
  @ApiProperty({
    description: 'The page you would like to visit',
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  page: number;

  @ApiProperty({
    description: 'Number of artworks that will be presented from the page.',
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  limit: number;
}
