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
import { QuizAnswersService } from './quiz-answers.service';
import { CreateQuizAnswerDto } from './dto/create-quiz-answer.dto';
import { UpdateQuizAnswerDto } from './dto/update-quiz-answer.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@UseGuards(AuthGuard(['auth0', 'jwt']))
@Controller('quiz-answers')
export class QuizAnswersController {
  constructor(private readonly quizAnswersService: QuizAnswersService) {}

  @Post('elementId')
  async createQuizeAnswer(
    @Param('elementId') elementId: string,
    @Body() createQuizAnswerDto: CreateQuizAnswerDto,
    @CurrentUser('email') email: string,
  ) {
    return this.quizAnswersService.createQuizAnswer(
      elementId,
      createQuizAnswerDto,
      email,
    );
  }

  @Patch(':id')
  async updateQuizAnswer(
    @Param('id') id: string,
    @Body() updateQuizAnswerDto: UpdateQuizAnswerDto,
    @CurrentUser('email') email: string,
  ) {
    return this.quizAnswersService.updateQuizAnswer(
      id,
      updateQuizAnswerDto,
      email,
    );
  }

  @Delete(':id')
  async removeQuizAnswer(
    @Param('id') id: string,
    @CurrentUser('email') email: string,
  ) {
    return this.quizAnswersService.removeQuizAnswer(id, email);
  }

  @Get('element/elementId')
  async findAllQuizAnswers(@Param('elementId') elementId: string) {
    return this.quizAnswersService.findAllQuizAnswers(elementId);
  }

  @Get(':id')
  async findQuizAnswer(@Param('id') id: string) {
    return this.quizAnswersService.findQuizAnswer(id);
  }
}
