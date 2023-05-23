import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ArtworkEntity } from './artwork.entity';
import { UserType } from '../enums/UserType.enum';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ default: 'password' })
  password: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.CANNOT_BUY,
  })
  canPurchase: UserType;

  @OneToMany(() => ArtworkEntity, (artwork) => artwork.owner)
  artworks: ArtworkEntity[];
}
