import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
} from 'typeorm';

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
}
