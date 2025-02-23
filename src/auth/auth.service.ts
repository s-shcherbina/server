import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { IPayloadToken } from 'src/common/types';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { TokensResponse } from './response';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async createTokensResponse(user: User): Promise<TokensResponse> {
    const { email } = user;
    const accessToken = await this.generateToken(
      { email },
      this.configService.getOrThrow('JWT_SECRET_ACCESS'),
      this.configService.getOrThrow('JWT_ACCESS_EXPIRESIN'),
    );
    const refreshToken = await this.generateToken(
      { email },
      this.configService.getOrThrow('JWT_SECRET_REFRESH'),
      this.configService.getOrThrow('JWT_REFRESH_EXPIRESIN'),
    );
    await this.saveToken(refreshToken, email);
    return { accessToken, refreshToken };
  }

  public async register(createAuthDto: CreateAuthDto) {
    const { password, ...userData } = createAuthDto;

    const hashedPassword = await hash(password);

    const createdUser = await this.usersService.create({
      ...userData,
      password: hashedPassword,
    });
    return this.createTokensResponse(createdUser);
  }

  public async validateUser(email: string, password: string) {
    const userByEmail = await this.usersService.findByEmail(email);
    if (!userByEmail) return null;

    if (!userByEmail.password)
      throw new BadRequestException('account created via provider');

    const isValidPassword = await verify(userByEmail.password, password);
    if (!isValidPassword) return null;

    return userByEmail;
  }

  public async logout(refreshToken: string) {
    await this.authRepository.delete({ refreshToken });
    return 'logout success';
  }

  public async refresh(refreshToken: string) {
    try {
      if (!refreshToken) throw new UnauthorizedException('not autorized');

      const dataToken = await this.validateRefreshToken(refreshToken);
      const tokenFromDb = await this.authRepository.findBy({ refreshToken });
      if (!dataToken || !tokenFromDb)
        throw new UnauthorizedException('not autorized');

      const user = await this.usersService.findByEmail(dataToken.email);
      return this.createTokensResponse(user);
    } catch (e) {
      throw new UnauthorizedException('not autorized');
    }
  }

  private async generateToken(
    data: IPayloadToken,
    secret: string,
    expiresIn: string,
  ) {
    return this.jwtService.signAsync(data, { secret, expiresIn });
  }

  private async saveToken(refreshToken: string, email: string) {
    const user = await this.usersService.findByEmail(email);
    const token = await this.authRepository
      .createQueryBuilder('token')
      .where('token.user_id = :id', { id: user.id })
      .getOne();

    token
      ? await this.authRepository.update({ id: token.id }, { refreshToken })
      : await this.authRepository.save({
          refreshToken,
          user,
        });
  }

  private async validateRefreshToken(token: string) {
    const dataToken: IPayloadToken = await this.jwtService.verify(token, {
      secret: this.configService.getOrThrow('JWT_SECRET_REFRESH'),
    });
    return dataToken;
  }

  public async getMe(payload: IPayloadToken) {
    const { name, email, picture } = payload;
    const userByEmail = await this.usersService.findByEmail(email);

    if (!userByEmail) {
      const user = await this.usersService.create({
        avatar: picture,
        name,
        email,
      });
      return this.usersService.filterResponse(user);
    }
    return this.usersService.filterResponse(userByEmail);
  }
}
