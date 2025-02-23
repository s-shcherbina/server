import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

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

  public async update(id: string, email: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update({ id }, { ...updateUserDto, email });
  }

  public async remove(id: string) {
    return this.userRepository.delete({ id });
  }
}
