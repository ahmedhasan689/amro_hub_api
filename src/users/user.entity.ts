import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Role } from '../common/enums/role.enum';
import { Subscription } from '../subscriptions/subscription.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({})
  isActive: boolean;

  @Column({ nullable: true })
  lastActiveAt: Date;

  @OneToOne(() => Subscription, (subscription) => subscription.user)
  subscription: Subscription;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  get isLastActive(): boolean {
    if (!this.lastActiveAt) return false;
    const diff = Date.now() - new Date(this.lastActiveAt).getTime();
    return diff < 5 * 60 * 1000;
  }
}
