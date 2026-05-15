import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type AttendanceStatus = 'present' | 'absent' | 'late';

@Entity('attendance')
@Index(['className', 'studentId', 'date'], { unique: true })
export class AttendanceRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  className: string;

  @Column()
  studentId: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'varchar', length: 16 })
  status: AttendanceStatus;

  @Column()
  teacherId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
