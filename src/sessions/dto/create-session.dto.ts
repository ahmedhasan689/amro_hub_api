import { IsISO8601 } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSessionDto {
  @IsISO8601({}, { message: 'entryAt must be a valid datetime' })
  @Type(() => Date)
  entryAt: Date;
}
