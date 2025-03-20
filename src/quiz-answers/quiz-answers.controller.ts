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
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  PartialType,
} from '@nestjs/swagger';
import { QuizElement } from 'src/quiz-elements/entities/quiz-element.entity';
import { QuizAnswer } from './entities/quiz-answer.entity';

@ApiTags('quiz-answers')
@UseGuards(AuthGuard(['auth0', 'jwt']))
@Controller('quiz-answers')
export class QuizAnswersController {
  constructor(private readonly quizAnswersService: QuizAnswersService) {}

  @ApiOperation({ description: 'creating a quiz answer' })
  @ApiBody({
    schema: {
      example: {
        correct: true,
        text: 'buy - is irregular verb',
        quizElement: { type: QuizElement },
      },
    },
  })
  @ApiOkResponse({ type: PartialType(QuizAnswer) })
  @Post()
  async createQuizeAnswer(
    @Body() createQuizAnswerDto: CreateQuizAnswerDto,
    @CurrentUser('email') email: string,
  ) {
    return this.quizAnswersService.createQuizAnswer(createQuizAnswerDto, email);
  }

  @ApiOperation({ description: 'getting all answers in quiz' })
  @ApiOkResponse({ type: [PartialType(QuizAnswer)] })
  @Get('quiz/:quizId')
  async findQuizAnswers(@Param('quizId') quizId: string) {
    return this.quizAnswersService.findQuizAnswers(quizId);
  }

  @ApiOperation({ description: 'updating a quiz answer' })
  @ApiBody({
    schema: {
      example: {
        correct: false,
        text: 'add - is irregular verb',
        quizElement: { type: QuizElement },
      },
    },
  })
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

  @ApiOperation({ description: 'getting all answers in an element' })
  @ApiOkResponse({ type: [PartialType(QuizAnswer)] })
  @Get('element/elementId')
  async findAllQuizAnswers(@Param('elementId') elementId: string) {
    return this.quizAnswersService.findAllQuizAnswers(elementId);
  }

  @ApiOperation({ description: 'getting a quiz answer' })
  @Get(':id')
  async findQuizAnswer(@Param('id') id: string) {
    return this.quizAnswersService.findQuizAnswer(id);
  }
}
