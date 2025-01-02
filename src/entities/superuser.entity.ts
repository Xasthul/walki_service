import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { SuperUserRefreshToken } from './superUserRefreshToken.entity';

@Entity()
export class SuperUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: false })
  isTwoFactorAuthenticationEnabled: boolean;

  @Column({ nullable: true })
  twoFactorAuthenticationSecret: string;

  @OneToOne(() => SuperUserRefreshToken, (refreshToken) => refreshToken.userId)
  refreshTokenId: string;
}
