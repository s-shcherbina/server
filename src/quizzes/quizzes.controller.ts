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
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  PartialType,
} from '@nestjs/swagger';
import { Quiz } from './entities/quiz.entity';
import { Company } from 'src/companies/entities/company.entity';

@ApiTags('quizzes')
@UseGuards(AuthGuard(['auth0', 'jwt']))
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @ApiOperation({ description: 'creating a quiz element' })
  @ApiBody({
    schema: {
      example: {
        title: 'Check your Engilish',
        description: 'English grammar tests',
        frequency: 3,
        company: { type: Company },
      },
    },
  })
  @ApiOkResponse({ type: PartialType(Quiz) })
  @Post()
  async createQuiz(
    @Body() createQuizDto: CreateQuizDto,
    @CurrentUser('email') email: string,
  ) {
    return this.quizzesService.createQuiz(createQuizDto, email);
  }

  @ApiOperation({ description: 'quiz element update' })
  @ApiBody({
    schema: {
      example: {
        description: 'Tests on irregular verbs in english',
        frequency: 7,
        valid: true,
      },
    },
  })
  @Patch(':id')
  async updateQuiz(
    @Param('id') id: string,
    @Body() updateQuizDto: UpdateQuizDto,
    @CurrentUser('email') email: string,
  ) {
    return this.quizzesService.updateQuiz(id, updateQuizDto, email);
  }

  @ApiOperation({ description: 'deleting a quiz' })
  @Delete(':id')
  async removeQuiz(
    @Param('id') id: string,
    @CurrentUser('email') email: string,
  ) {
    return this.quizzesService.removeQuiz(id, email);
  }

  @ApiOperation({ description: 'getting available quizzes in company ' })
  @ApiOkResponse({ type: [PartialType(Quiz)] })
  @Get('company/:companyId')
  async findCompanyQuizzes(@Param('companyId') companyId: string) {
    return this.quizzesService.findCompanyQuizzes(companyId);
  }

  @ApiOperation({ description: 'getting all quizzes in company' })
  @ApiOkResponse({ type: [PartialType(Quiz)] })
  @Get('all/:companyId')
  async findAllCompanyQuizzes(@Param('companyId') companyId: string) {
    return this.quizzesService.findAllCompanyQuizzes(companyId);
  }

  @ApiOperation({ description: 'getting one quiz' })
  @ApiOkResponse({ type: PartialType(Quiz) })
  @Get(':id')
  async findQuiz(@Param('id') id: string) {
    return this.quizzesService.findQuiz(id);
  }
}
