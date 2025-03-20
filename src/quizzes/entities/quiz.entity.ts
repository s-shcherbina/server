import { Base } from 'src/common/global/base-entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { QuizElement } from 'src/quiz-elements/entities/quiz-element.entity';
import { Company } from 'src/companies/entities/company.entity';
import { QuizResult } from 'src/quiz-results/entities/quiz-result.entity';

@Entity({ name: 'quizzes' })
export class Quiz extends Base {
  @ApiProperty({
    required: true,
    nullable: false,
    description: 'quiz title',
  })
  @Column({ nullable: false })
  title: string;

  @ApiProperty({
    required: true,
    nullable: false,
    description: 'quiz description',
  })
  @Column({ nullable: false })
  description: string;

  @ApiProperty({
    required: true,
    nullable: false,
    description: 'number indicating quiz completion frequency in days',
  })
  @Column({ nullable: false })
  frequency: number;

  @ApiProperty({
    required: true,
    nullable: false,
    description: 'availability of the quiz for passing',
  })
  @Column({ nullable: false, default: false })
  valid: boolean;

  @OneToMany(() => QuizElement, (quizElement) => quizElement.quiz)
  quizElements: QuizElement[];

  @OneToMany(() => QuizResult, (quizResult) => quizResult.quiz)
  quizResults: QuizResult[];

  @ManyToOne(() => Company, (company) => company.quizzes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
