import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminQueryDto } from './dto/admin-query.dto';
import { AdminResource } from './resources/admin.resource';
import { Admin } from './admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  /**
   * Find All Admins
   * @param query
   */
  async findAll(query: AdminQueryDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const qb = this.adminRepository.createQueryBuilder('admin');

    // Filter by search
    if (search) {
      qb.andWhere('admin.name LIKE :search', { search: `%${search}%` });
    }

    // Pagination
    const [admins, total] = await qb.skip(skip).take(limit).getManyAndCount();

    return {
      data: AdminResource.collection(admins),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get My Profile
   * @param admin
   */
  async getMyProfile(admin: any) {
    return new AdminResource(admin);
  }

  /**
   * Find Admin By Email With Password
   * @param email
   * @return Admin
   */
  async findByEmailWithPassword(email: string): Promise<Admin | null> {
    const qb = this.adminRepository
      .createQueryBuilder('admin')
      .select(['admin.id', 'admin.name', 'admin.email', 'admin.password'])
      .where('admin.email = :email', { email });

    return await qb.getOne();
  }
}
