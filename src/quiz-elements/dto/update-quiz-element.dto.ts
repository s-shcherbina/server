import { PartialType } from '@nestjs/swagger';
import { CreateQuizElementDto } from './create-quiz-element.dto';

export class UpdateQuizElementDto extends PartialType(CreateQuizElementDto) {}
