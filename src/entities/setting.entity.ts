import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string;

  @Column({ type: 'text', nullable: true })
  value?: string;

  @Column({ nullable: true })
  label?: string;

  @Column({ nullable: true })
  description?: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
