import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

const STATUSES = ['present', 'absent', 'late'] as const;

export class AttendanceEntryDto {
  @ApiProperty()
  @IsInt()
  studentId: number;

  @ApiProperty({ enum: STATUSES })
  @IsIn(STATUSES as unknown as string[])
  status: (typeof STATUSES)[number];
}

export class BatchAttendanceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  className: string;

  @ApiProperty({ description: 'YYYY-MM-DD' })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ type: [AttendanceEntryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceEntryDto)
  entries: AttendanceEntryDto[];
}
