import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

const NOTICE_TYPES = [
  'general',
  'academic',
  'exam',
  'holiday',
  'admission',
] as const;

export class UpdateNoticeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  body?: string;

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
