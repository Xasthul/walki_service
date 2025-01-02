import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Superuser } from './superuser.entity';

@Entity()
export class SuperuserRefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Superuser, (user) => user.refreshTokenId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: Superuser;

  @Column('uuid')
  userId: string;
}
