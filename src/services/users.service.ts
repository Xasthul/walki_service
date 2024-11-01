import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserPayload } from 'src/types/requestBody/createUserPayload.dto';
import { UserResponseModel } from 'src/types/response/userResponseModel.dto';
import { generatePasswordHash } from 'src/utils/hashing';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserPayload: CreateUserPayload): Promise<void> {
    const doesUserAlreadyExist = await this.usersRepository.existsBy({
      email: createUserPayload.email,
    });
    if (doesUserAlreadyExist) {
      throw new ConflictException();
    }
    const user = new User();
    user.email = createUserPayload.email;
    user.name = createUserPayload.name;
    user.password = await generatePasswordHash(createUserPayload.password);
    await this.usersRepository.insert(user);
  }

  async findById(userId: string): Promise<UserResponseModel> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { visitedPlaces: false },
    });
    if (!user) {
      throw new InternalServerErrorException();
    }

    return {
      name: user.name,
      email: user.email,
    };
  }

  async delete(userId: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { visitedPlaces: false },
    });
    if (!user) {
      throw new InternalServerErrorException();
    }

    await this.usersRepository.remove(user);
  }
}
