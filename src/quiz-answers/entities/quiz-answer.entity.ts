import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/common/global/base-entity';
import { QuizElement } from 'src/quiz-elements/entities/quiz-element.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'answers' })
export class QuizAnswer extends Base {
  @ApiProperty({
    required: true,
    nullable: false,
    description: 'correct answer or incorrect',
  })
  @Column({ nullable: false })
  correct: boolean;

  @ApiProperty({
    required: true,
    nullable: false,
    description: 'quiz answer text',
  })
  @Column({ nullable: false })
  text: string;

  @ManyToOne(() => QuizElement, (element) => element.quizAnswers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'element_id' })
  element: QuizElement;
}
