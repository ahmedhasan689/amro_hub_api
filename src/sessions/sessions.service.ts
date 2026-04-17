import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './session.entity';
import { Between, Repository } from 'typeorm';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class SessionsService {
  FREE_HOURS_PER_WEEK = 2;
  PRICE_PER_HOUR = 4;

  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async create(clientId: string, createSessionDto: CreateSessionDto ) {
    const entryAt = new Date(createSessionDto.entryAt);

    const startOfDay = new Date(entryAt);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(entryAt);
    endOfDay.setHours(23, 59, 59, 999);

    const existingSession = await this.sessionRepository.findOne({
      where: {
        client: {
          id: clientId,
        },
        entryAt: Between(startOfDay, endOfDay),
      },
    });

    if (existingSession) {
      throw new BadRequestException(
        'Session already exists for this client today',
      );
    }

    const session = this.sessionRepository.create({
        client: {
          id: clientId,
        },
      entryAt,
    });

    return await this.sessionRepository.save(session);
  };

  async checkOut(sessionId: string) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['client'],
    });

    if (!session) throw new NotFoundException('SESSION_NOT_FOUND');
    if (session.checkOutAt)
      throw new BadRequestException('SESSION_ALREADY_CHECKED_OUT');

    const checkOutAt = new Date();
    const diffMs = checkOutAt.getTime() - session.entryAt.getTime();
    const hoursCount = diffMs / (1000 * 60 * 60);

    const weekStart = this.getWeekStart();

    const weekFreeHoursUsed = await this.sessionRepository
      .createQueryBuilder('session')
      .select('SUM(session.freeHoursUsed)', 'total')
      .where('session.clientId = :clientId', { clientId: session.client.id })
      .andWhere('session.entryAt >= :weekStart', { weekStart })
      .andWhere('session.id != :sessionId', { sessionId })
      .getRawOne()
      .then((res) => parseFloat(res.total ?? '0'));

    const remainingFreeHours = Math.max(
      0,
      this.FREE_HOURS_PER_WEEK - weekFreeHoursUsed,
    );

    const freeHoursUsed = Math.min(hoursCount, remainingFreeHours);

    const billableHours = Math.max(0, hoursCount - freeHoursUsed);
    const amount = billableHours * this.PRICE_PER_HOUR;

    return await this.sessionRepository.manager.transaction(async (manager) => {
      await manager.update(Session, sessionId, {
        checkOutAt,
        hoursCount: parseFloat(hoursCount.toFixed(2)),
        freeHoursUsed: parseFloat(freeHoursUsed.toFixed(2)),
        billableHours: parseFloat(billableHours.toFixed(2)),
        amount: parseFloat(amount.toFixed(2)),
      });

      return manager.findOne(Session, {
        where: { id: sessionId },
        relations: ['client'],
      });
    });
  }

  private getWeekStart(): Date {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day;
    const weekStart = new Date(now.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  }
}
