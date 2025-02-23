import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  PartialType,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@UseGuards(AuthGuard(['auth0', 'jwt']))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ description: 'creating a user' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        name: 'Alex',
        email: 'test@test.com',
        password: 'hash',
      },
    },
  })
  @ApiOkResponse({ type: PartialType(User) })
  @Post()
  public async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ description: 'getting all users' })
  @ApiOkResponse({ type: [PartialType(User)] })
  @Get()
  public async findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ description: 'getting one user' })
  @ApiOkResponse({ type: PartialType(User) })
  @Get('user/:id')
  public async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ description: 'user update' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        name: 'Alex',
        password: '123456',
      },
    },
  })
  @Patch()
  public async update(
    @CurrentUser('id', 'email') userId: string,
    email: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(userId, email, updateUserDto);
  }

  @ApiOperation({ description: 'deleting a user' })
  @Delete()
  public async remove(@CurrentUser('id') userId: string) {
    await this.usersService.remove(userId);
  }
}
