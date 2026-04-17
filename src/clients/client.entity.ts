import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClientType } from '../common/enums/client-type.enum';
import { University } from '../common/enums/university.enum';
import { Session } from '../sessions/session.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({})
  name: string;

  @Column({ unique: true })
  clientNumber: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({})
  avatar: string;

  @Column({ type: 'enum', enum: ClientType })
  clientType: ClientType;

  @Column({ type: 'enum', enum: University })
  university: University;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Session, (session) => session.client)
  sessions: Session[]

  get avatarUrl(): string | null {
    return this.avatar
      ? `${process.env.APP_URL}/uploads/products/${this.avatar}`
      : null;
  }
}