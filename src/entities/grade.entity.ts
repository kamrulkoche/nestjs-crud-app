import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('grades')
@Index(['className', 'category', 'studentId'], { unique: true })
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  className: string;

  @Column()
  category: string;

  @Column()
  studentId: number;

  @Column({ type: 'float' })
  score: number;

  @Column()
  teacherId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
