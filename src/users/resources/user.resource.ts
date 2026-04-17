import { User } from '../user.entity';

export class UserResource {
  id: string;
  name: string;
  //coverImage: string | null;
  subscriptionName: string;
  paymentStatus: string;
  startAt: Date;
  endAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.subscriptionName = user.subscription.type;
    this.paymentStatus = user.subscription.paymentStatus;
    this.startAt = user.subscription.startAt;
    this.endAt = user.subscription.endAt;
  }

  static collection(users: User[]): UserResource[] {
    return users.map((user) => new UserResource(user));
  }
}