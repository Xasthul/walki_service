import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
