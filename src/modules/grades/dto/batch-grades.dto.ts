import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class GradeEntryDto {
  @ApiProperty()
  @IsInt()
  studentId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;
}

export class BatchGradesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  className: string;

  @ApiProperty({ type: [GradeEntryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GradeEntryDto)
  entries: GradeEntryDto[];
}
