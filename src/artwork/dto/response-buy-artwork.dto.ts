import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { UserEntity } from '../../auth/entity/user.entity';

export class ResponseArtworkPurchaseDto {
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
  name: string;

  @ApiProperty({
    description: 'The owner of the artwork',
  })
  @IsNotEmpty()
  owner: UserEntity;

  @ApiProperty({
    description: 'The owner of the artwork',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
