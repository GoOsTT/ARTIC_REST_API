import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ResponseSingleArtWorkDto {
  @ApiProperty({
    description: 'The id of the artwork',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'The title of the artwork',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The author of the artwork',
  })
  @IsNotEmpty()
  @IsNumber()
  author: string;

  @ApiProperty({
    description: 'The id of the artwork',
  })
  @IsOptional()
  thumbnail?: string;
}
