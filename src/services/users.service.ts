import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfanityClient } from 'src/clients/ProfanityClient/profanity.client';
import { User } from 'src/entities/user.entity';
import { CreateUserPayload } from 'src/types/requestBody/createUserPayload.dto';
import { UserResource } from 'src/types/response/userResource.dto';
import { generatePasswordHash } from 'src/utils/hashing';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private profanityClient: ProfanityClient,
  ) { }

  async create(createUserPayload: CreateUserPayload): Promise<void> {
    const doesUserAlreadyExist = await this.usersRepository.existsBy({
      email: createUserPayload.email,
    });
    if (doesUserAlreadyExist) {
      throw new ConflictException();
    }

    const profanityCheck = await this.profanityClient.verify(createUserPayload.name);
    if (profanityCheck.isProfanity) {
      throw new BadRequestException();
    }

    const user = new User();
    user.email = createUserPayload.email;
    user.name = createUserPayload.name;
    user.password = await generatePasswordHash(createUserPayload.password);
    await this.usersRepository.save(user);
  }

  async findById(userId: string): Promise<UserResource> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new InternalServerErrorException();
    }

    return {
      name: user.name,
      email: user.email,
    };
  }

  async delete(userId: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new InternalServerErrorException();
    }

    await this.usersRepository.remove(user);
  }
}
