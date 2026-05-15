import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type NoticeType = 'general' | 'academic' | 'exam' | 'holiday' | 'admission';

@Entity('notices')
export class Notice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'varchar', length: 32, default: 'general' })
  type: NoticeType;

  @Column({ nullable: true })
  pdfUrl?: string;

  @Column({ default: true })
  published: boolean;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
