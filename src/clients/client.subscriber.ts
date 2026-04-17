import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
} from 'typeorm';
import { Client } from './client.entity';

@EventSubscriber()
export class ClientSubscriber implements EntitySubscriberInterface<Client> {
  listenTo(): Function | string {
    return Client;
  }

  async beforeInsert(event: InsertEvent<Client>) {
    const currentYear = new Date().getFullYear();

    while (true) {
      const randomDigits = Math.floor(100000 + Math.random() * 900000);
      const clientNumber = `CL-${currentYear}-${randomDigits}`;

      const exists = await event.manager.existsBy(Client, { clientNumber });

      if (!exists) {
        event.entity.clientNumber = clientNumber;
        break;
      }
    }
  }
}
