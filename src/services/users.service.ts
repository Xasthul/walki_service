import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserPayload } from 'src/types/requestBody/createUserPayload.dto';
import { generatePasswordHash } from 'src/utils/hashing';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { };

  async create(createUserPayload: CreateUserPayload) {
    const doesUserAlreadyExist = await this.usersRepository.existsBy({ email: createUserPayload.email });
    if (doesUserAlreadyExist) {
      throw new ConflictException();
    }
    const user = new User();
    user.email = createUserPayload.email;
    user.password = await generatePasswordHash(createUserPayload.password);
    await this.usersRepository.insert(user);
  }
}
