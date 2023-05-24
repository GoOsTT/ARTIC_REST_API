import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ArtworkOwnerShip } from './artwork.entity';
import { UserType } from '../enums/UserType.enum';

@Entity()
export class User {
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

  @OneToMany(() => ArtworkOwnerShip, (artwork) => artwork.owner)
  artworks: ArtworkOwnerShip[];
}
