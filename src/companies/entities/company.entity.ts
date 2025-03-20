import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/common/global/base-entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CompanyAction } from '../../company-actions/entities/company-actions.entity';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { QuizResult } from 'src/quiz-results/entities/quiz-result.entity';

@Entity({ name: 'companies' })
export class Company extends Base {
  @ApiProperty({
    nullable: false,
    description: 'companу title',
  })
  @Column({ nullable: false, unique: true })
  title: string;

  @ApiProperty({
    required: true,
    nullable: false,
    description: 'companу description',
  })
  @Column({ nullable: false })
  description: string;

  @ApiProperty({
    required: true,
    nullable: false,
    description: 'companу visibility',
  })
  @Column({ nullable: false, default: true })
  visibility: boolean;

  @ApiProperty({
    required: true,
    nullable: false,
    type: () => User,
    description: 'company creator',
  })
  @ManyToOne(() => User, (user) => user.companies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => CompanyAction, (companyAction) => companyAction.company)
  companyActions: CompanyAction[];

  @ManyToMany(() => User, (user) => user.companies, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinTable({
    name: 'users_companies',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'company_id',
      referencedColumnName: 'id',
    },
  })
  users?: User[];

  @OneToMany(() => Quiz, (quiz) => quiz.company)
  quizzes: Quiz[];

  @OneToMany(() => QuizResult, (quizResults) => quizResults.company)
  quizResults: QuizResult[];
}
