import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/global/base-response';
import { QuizElement } from 'src/quiz-elements/entities/quiz-element.entity';

export class QuizResponse extends BaseResponse {
  @ApiProperty({
    required: true,
    nullable: false,
    description: 'quiz title',
  })
  title: string;

  @ApiProperty({
    required: true,
    nullable: false,
    description: 'quiz description',
  })
  description: string;

  date: Date;

  daysLeft: number;

  quizElements: QuizElement[];
}
