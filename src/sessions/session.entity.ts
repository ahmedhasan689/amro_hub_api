import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from '../clients/client.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Client, (client) => client.sessions)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column({ type: 'datetime' })
  entryAt: Date;

  @Column({ type: 'datetime', nullable: true })
  checkOutAt: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hoursCount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  freeHoursUsed: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  billableHours: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}