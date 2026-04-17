import { Admin } from '../admin.entity';

export class AdminResource {
  id: string;
  name: string;
  email: string;
  coverImage: string | null;

  constructor(admin: Admin) {
    this.id = admin.id;
    this.name = admin.name;
    this.email = admin.email;
  }

  static collection(admins: Admin[]): AdminResource[] {
    return admins.map((admin) => new AdminResource(admin));
  }
}
