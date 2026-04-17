import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserQueryDto } from './dto/user-query-dto';
import { UserResource } from './resources/user.resource';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  /**
   * Find All Users
   * @param query
   * @return Array of users
   */
  async findAll(query: UserQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
    } = query;
    const skip = (page - 1) * limit;

    const qb = this.repository.createQueryBuilder('user');

    qb.leftJoinAndSelect('user.subscription', 'subscription');

    // Filter by search
    if (search) {
      qb.andWhere('user.name LIKE :search', { search: `%${search}%` });
    }

    // Select Users JUST
    qb.andWhere('user.role = :role', { role: 'user' });

    // Pagination
    const [users, total] = await qb.skip(skip).take(limit).getManyAndCount();

    return {
      data: {
        users: UserResource.collection(users),
        count: total,
      },
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find User By Email With Password
   * @param email
   * @param role
   * @return User
   */
  async findByEmailWithPassword(
    email: string,
    role?: string,
  ): Promise<User | null> {
    const qb = this.repository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.phoneNumber',
        'user.password',
        'user.role',
      ])
      .where('user.email = :email', { email });

    if (role) {
      qb.andWhere('user.role = :role', { role });
    }

    return await qb.getOne();
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
