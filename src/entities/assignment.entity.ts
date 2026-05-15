import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type AssignmentStatus = 'draft' | 'active' | 'graded';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  className: string;

  @Column({ type: 'date' })
  due: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 16, default: 'active' })
  status: AssignmentStatus;

  @Column({ type: 'int', default: 0 })
  submitted: number;

  @Column({ type: 'int', default: 0 })
  total: number;

  @Column()
  teacherId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
