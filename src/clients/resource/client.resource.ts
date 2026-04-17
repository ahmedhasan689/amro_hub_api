import { Client } from '../client.entity';

export class ClientResource {
  id: string;
  name: string;
  clientNumber: string;
  email: string;
  avatar: string | null;
  entryAt: number;
  checkOutAt: number;
  hours: number;
  orders: string;
  // createdAt: Date;

  constructor(client: Client) {
    this.id = client.id;
    this.name = client.name;
    this.clientNumber = client.clientNumber;
    this.email = client.email;
    this.avatar = client.avatarUrl;
    // this.entryAt = client.entryAt;
    // this.checkOutAt = client.checkOutAt;
    // this.hours = client.hours;
    // this.orders = client.orders;
  }

  static collection(clients: Client[]): ClientResource[] {
    return clients.map((client) => new ClientResource(client));
  }
}
