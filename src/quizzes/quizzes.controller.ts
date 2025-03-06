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

@UseGuards(AuthGuard(['auth0', 'jwt']))
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post(':companyId')
  async createQuiz(
    @Param('companyId') companyId: string,
    @Body() createQuizDto: CreateQuizDto,
    @CurrentUser('email') email: string,
  ) {
    return this.quizzesService.createQuiz(companyId, createQuizDto, email);
  }

  @Patch(':id')
  async updateQuiz(
    @Param('id') id: string,
    @Body() updateQuizDto: UpdateQuizDto,
    @CurrentUser('email') email: string,
  ) {
    return this.quizzesService.updateQuiz(id, updateQuizDto, email);
  }

  @Delete(':id')
  async removeOne(
    @Param('id') id: string,
    @CurrentUser('email') email: string,
  ) {
    return this.quizzesService.removeQuiz(id, email);
  }

  @Get('company/:companyId')
  async findAllCompanyQuizzes(@Param('companyId') companyId: string) {
    return this.quizzesService.findAllCompanyQuizzes(companyId);
  }

  @Get(':id')
  async findQuiz(@Param('id') id: string) {
    return this.quizzesService.findQuiz(id);
  }
}
