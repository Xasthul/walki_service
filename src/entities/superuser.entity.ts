import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
} from 'typeorm';
import { SuperuserRefreshToken } from './superuserRefreshToken.entity';

@Entity()
export class Superuser {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ default: false })
    isTwoFactorAuthenticationEnabled: boolean;

    @Column()
    twoFactorAuthenticationSecret: string;

    @OneToOne(() => SuperuserRefreshToken, (refreshToken) => refreshToken.userId)
    refreshTokenId: string;
}
