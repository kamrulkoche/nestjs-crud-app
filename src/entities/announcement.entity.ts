import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ default: 'all' })
  targetClass: string;

  @Column()
  teacherId: number;

  @CreateDateColumn()
  createdAt: Date;
}
