import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  /**
   * Find All Users
   * @param email
   * @return Array of users
   */
  async findAll(email: string | undefined): Promise<User[] | null> {
    return await this.repository.find({ where: { email } });
  }

  /**
   * Find User By Email With Password
   * @param email
   * @return User
   */
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return await this.repository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.phoneNumber',
        'user.password',
      ])
      .where('user.email = :email', { email })
      .getOne();
  }

  /**
   * Find One User By ID
   * @param id
   * @return User
   */
  async findOne(id: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user)
      throw new NotFoundException(`User Not Found With This ID : ${id}`);

    return user;
  }

  /**
   * Create User
   * @param registerDto
   * @return User
   */
  async create(registerDto: Partial<User>): Promise<User> {
    const { email } = registerDto;
    const existing = await this.repository.findOneBy({ email });
    if (existing) throw new ConflictException('This Email Already Exists');

    const user = this.repository.create(registerDto);
    return this.repository.save(user);
  }
}
