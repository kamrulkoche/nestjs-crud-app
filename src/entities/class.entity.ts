import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('classes')
export class ClassRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  grade: string;

  @Column()
  schedule: string;

  @Column({ nullable: true })
  room?: string;

  @Column({ default: 'from-blue-500 to-indigo-500' })
  color: string;

  @Column({ type: 'int', default: 0 })
  studentCount: number;

  @Column({ type: 'int', default: 0 })
  progress: number;

  @Column()
  teacherId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
