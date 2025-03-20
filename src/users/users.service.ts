import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  public filterResponse(user: User) {
    const { password, ...userData } = user;
    return userData;
  }

  public async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  public async updateRating(id: string, rating: number) {
    return this.userRepository.update({ id }, { rating });
  }

  public async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const userByEmail = await this.findByEmail(email);

    if (userByEmail) throw new ConflictException(`${email} already taken`);

    return this.userRepository.save({ ...createUserDto });
  }

  public async findAll() {
    const users = await this.userRepository.find();
    return users.map((it) => this.filterResponse(it));
  }

  public async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    return this.filterResponse(user);
  }

  public async update(email: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.email)
      throw new BadRequestException('changing email is not allowed');
    if (updateUserDto.password)
      updateUserDto.password = await hash(updateUserDto.password);

    const user = await this.findByEmail(email);
    return this.userRepository.update({ id: user.id }, { ...updateUserDto });
  }

  public async remove(email: string) {
    const user = await this.findByEmail(email);
    return this.userRepository.delete({ id: user.id });
  }
}
