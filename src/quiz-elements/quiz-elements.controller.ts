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
import { QuizElementsService } from './quiz-elements.service';
import { CreateQuizElementDto } from './dto/create-quiz-element.dto';
import { UpdateQuizElementDto } from './dto/update-quiz-element.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  PartialType,
} from '@nestjs/swagger';
import { QuizElement } from './entities/quiz-element.entity';
import { Quiz } from 'src/quizzes/entities/quiz.entity';

@ApiTags('quiz-elements')
@UseGuards(AuthGuard(['auth0', 'jwt']))
@Controller('quiz-elements')
export class QuizElementsController {
  constructor(private readonly quizElementsService: QuizElementsService) {}

  @ApiOperation({ description: 'creating a quiz element' })
  @ApiBody({
    schema: {
      example: {
        question: '2 * 2 ?',
        quiz: { type: Quiz },
      },
    },
  })
  @ApiOkResponse({ type: PartialType(QuizElement) })
  @Post()
  async createQuizElement(
    @Body() createQuizElementDto: CreateQuizElementDto,
    @CurrentUser('email') email: string,
  ) {
    return this.quizElementsService.createQuizElement(
      createQuizElementDto,
      email,
    );
  }

  @ApiOperation({ description: 'quiz element update' })
  @ApiBody({
    schema: {
      example: {
        question: 'Our company is the best?',
      },
    },
  })
  @ApiOkResponse({ type: PartialType(QuizElement) })
  @Patch(':id')
  async updateQuizElement(
    @Param('id') id: string,
    @Body() updateQuizElementDto: UpdateQuizElementDto,
    @CurrentUser('email') email: string,
  ) {
    return this.quizElementsService.updateQuizElement(
      id,
      updateQuizElementDto,
      email,
    );
  }

  @ApiOperation({ description: 'deleting a quiz element' })
  @Delete(':id')
  async removeQuizElement(
    @Param('id') id: string,
    @CurrentUser('email') email: string,
  ) {
    return this.quizElementsService.removeQuizElement(id, email);
  }

  @ApiOperation({ description: 'getting quiz elements' })
  @ApiOkResponse({ type: [PartialType(QuizElement)] })
  @Get('quiz/:quizId')
  async findQuizElements(@Param('quizId') quizId: string) {
    return this.quizElementsService.findQuizElements(quizId);
  }

  @ApiOperation({ description: 'getting quiz element' })
  @ApiOkResponse({ type: PartialType(QuizElement) })
  @Get(':id')
  async findQuizElement(@Param('id') id: string) {
    return this.quizElementsService.findQuizElement(id);
  }
}
