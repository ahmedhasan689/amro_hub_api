import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { ClientResource } from './resource/client.resource';
import { ClientQueryDto } from './dto/client-query.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { deleteFile } from '../common/multer/file-helper';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  /**
   * Find All Clients
   * @param query
   */
  async findAll(query: ClientQueryDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const qb = this.clientRepository.createQueryBuilder('client');

    if (search) {
      qb.andWhere('client.name LIKE :search', { search: `%${search}%` });
    }

    const [clients, total] = await qb.skip(skip).take(limit).getManyAndCount();

    return {
      data: ClientResource.collection(clients),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create Functionality
   * @param createClientDto
   * @param avatar
   */
  async create(createClientDto: CreateClientDto, avatar?: string) {
    const client = this.clientRepository.create({
      ...createClientDto,
      avatar: avatar,
    });

    const saved = await this.clientRepository.save(client);

    return new ClientResource(saved);
  }

  /**
   * Find Specific Client Functionality
   * @param id
   */
  async findOne(id: string): Promise<ClientResource> {
    const client = await this.clientRepository.findOneBy({ id });

    if (!client) {
      throw new NotFoundException('Client_NOT_FOUND');
    }

    return new ClientResource(client);
  }

  /**
   * Update Functionality
   * @param id
   * @param updateClientDto
   * @param avatar
   */
  async update(id: string, updateClientDto: UpdateClientDto, avatar?: string) {
    const client = await this.clientRepository.findOneBy({ id });

    if (!client) {
      throw new NotFoundException('CLIENT_NOT_FOUND');
    }

    if (avatar) {
      deleteFile('products', client.avatar);
    }

    const updated = await this.clientRepository.save({
      ...client!,
      ...updateClientDto,
      ...(avatar && { avatar }),
    });

    return new ClientResource(updated);
  }

  /**
   * Delete Functionality
   * @param id
   */
  async delete(id: string): Promise<void> {
    const result = await this.clientRepository.softDelete(id);

    if (!result.affected) {
      throw new NotFoundException('CLIENT_NOT_FOUND');
    }
  }
}
