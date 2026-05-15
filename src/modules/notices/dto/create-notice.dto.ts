import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

const NOTICE_TYPES = [
  'general',
  'academic',
  'exam',
  'holiday',
  'admission',
] as const;

export class CreateNoticeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Body is required' })
  body: string;

  @ApiPropertyOptional({ enum: NOTICE_TYPES })
  @IsOptional()
  @IsIn(NOTICE_TYPES as unknown as string[])
  type?: (typeof NOTICE_TYPES)[number];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pdfUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
