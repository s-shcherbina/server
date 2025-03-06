import { Base } from 'src/common/global/base-entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { QuizElement } from 'src/quiz-elements/entities/quiz-element.entity';
import { Company } from 'src/companies/entities/company.entity';

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

  @Column({ nullable: false })
  date: Date;

  @OneToMany(() => QuizElement, (quizElement) => quizElement.quiz)
  quizElements: QuizElement[];

  @ManyToOne(() => Company, (company) => company.quizzes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company' })
  company: Company;
}
