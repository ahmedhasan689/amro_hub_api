import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

async function runSeed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const hashedPassword = await bcrypt.hash('12345678', 10);
  const id = uuidv4();


  await dataSource.query(`
    INSERT IGNORE INTO users (id, name, email, phoneNumber, password, createdAt, updatedAt) VALUES 
    ('${id}', 'Admin', 'admin@amrohub.com', '0599724037', '${hashedPassword}', now(), now())
  `);

  console.log('✅ Seeding completed!');
  await app.close();
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
