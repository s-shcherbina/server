import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthResponse } from './response';
import { AuthGuard } from '@nestjs/passport';
import { PayloadToken } from 'src/decorators/payload-token.decorator';
import { IPayloadToken } from 'src/common/types';
import { LogoutDto } from './dto/logout.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: 'register a user' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        name: 'Alex',
        email: 'test@test.com',
        password: '123456',
      },
    },
  })
  @ApiOkResponse({ type: AuthResponse })
  @Post('register')
  public async register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @ApiOperation({ description: 'sign in a user' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        name: 'Alex',
        email: 'test@test.com',
      },
    },
  })
  @ApiOkResponse({ type: AuthResponse })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  public async login(@CurrentUser() user: User) {
    return this.authService.createTokensResponse(user);
  }

  @ApiOperation({ description: 'logout user' })
  @Post('logout')
  async logout(@Body() dto: LogoutDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @ApiOperation({ description: 'refresh jwt token' })
  @Post('refresh')
  async refresh(@Body() dto: LogoutDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @ApiOperation({ description: 'get data about currentuser' })
  @Get('me')
  @UseGuards(AuthGuard(['auth0', 'jwt']))
  public async getMe(@PayloadToken() payload: IPayloadToken) {
    return this.authService.getMe(payload);
  }
}
