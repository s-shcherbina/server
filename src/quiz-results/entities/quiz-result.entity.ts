import { Base } from 'src/common/global/base-entity';
import { Company } from 'src/companies/entities/company.entity';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'quiz_results' })
export class QuizResult extends Base {
  @Column({ nullable: false, default: 0 })
  questions: number;

  @Column({ name: 'correct_answers', nullable: false, default: 0 })
  correctAnswers: number;

  @Column({ name: 'member_questions', nullable: false, default: 0 })
  memberQuestions: number;

  @Column({ name: 'member_correct_answers', nullable: false, default: 0 })
  memberCorrectAnswers: number;

  @Column({ name: 'user_questions', nullable: false, default: 0 })
  userQuestions: number;

  @Column({ name: 'user_correct_answers', nullable: false, default: 0 })
  userCorrectAnswers: number;

  @ManyToOne(() => User, (user) => user.quizResults, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Quiz, (quiz) => quiz.quizResults, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;

  @ManyToOne(() => Company, (company) => company.quizResults, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
