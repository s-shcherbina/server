import { Base } from 'src/common/global/base-entity';
import { QuizElement } from 'src/quiz-elements/entities/quiz-element.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'answers' })
export class QuizAnswer extends Base {
  @Column({ nullable: false })
  text: string;

  @ManyToOne(() => QuizElement, (element) => element.quizAnswers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'element_id' })
  element: QuizElement;
}
