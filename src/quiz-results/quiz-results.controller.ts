import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { QuizResultsService } from './quiz-results.service';
import { CreateQuizResultDto } from './dto/create-quiz-result.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
// import { UpdateQuizResultDto } from './dto/update-quiz-result.dto';

@UseGuards(AuthGuard(['auth0', 'jwt']))
@Controller('quiz-results')
export class QuizResultsController {
  constructor(private readonly quizResultsService: QuizResultsService) {}

  @Post()
  async create(
    @Body() createQuizResultDto: CreateQuizResultDto,
    @CurrentUser('email') email: string,
  ) {
    return this.quizResultsService.create(createQuizResultDto, email);
  }

  @Get('quiz/:quizId')
  async findQuizResul(
    @Param('quizId') quizId: string,
    @CurrentUser('email') email: string,
  ) {
    return this.quizResultsService.findQuizResults(quizId, email);
  }

  @Get('company/:companyId')
  async findCompanyQuizResults(
    @Param('companyId') companyId: string,
    @CurrentUser('email') email: string,
  ) {
    return this.quizResultsService.findCompanyQuizResults(companyId, email);
  }

  @Get('user')
  async findUserResults(@CurrentUser('email') email: string) {
    return this.quizResultsService.findUserResults(email);
  }
}
