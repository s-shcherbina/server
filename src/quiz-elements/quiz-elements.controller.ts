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

@UseGuards(AuthGuard(['auth0', 'jwt']))
@Controller('quiz-elements')
export class QuizElementsController {
  constructor(private readonly quizElementsService: QuizElementsService) {}

  @Post(':quizId')
  async createQuizElement(
    @Param('quizId') quizId: string,
    @Body() createQuizElementDto: CreateQuizElementDto,
    @CurrentUser('email') email: string,
  ) {
    return this.quizElementsService.createQuizElement(
      quizId,
      createQuizElementDto,
      email,
    );
  }

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

  @Delete(':id')
  async removeQuizElement(
    @Param('id') id: string,
    @CurrentUser('email') email: string,
  ) {
    return this.quizElementsService.removeQuizElement(id, email);
  }

  @Get('quiz/:quizId')
  async findAllQuizElement(@Param('quizId') quizId: string) {
    return this.quizElementsService.findAllQuizElements(quizId);
  }

  @Get(':id')
  async findQuizElement(@Param('id') id: string) {
    return this.quizElementsService.findQuizElement(id);
  }
}
