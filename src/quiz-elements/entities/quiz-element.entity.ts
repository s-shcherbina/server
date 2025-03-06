import { Base } from 'src/common/global/base-entity';
import { QuizAnswer } from 'src/quiz-answers/entities/quiz-answer.entity';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'elemets' })
export class QuizElement extends Base {
  @Column({ nullable: false })
  question: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.quizElements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;

  @OneToMany(() => QuizAnswer, (quizAnswer) => quizAnswer.element)
  quizAnswers: QuizAnswer[];
}
