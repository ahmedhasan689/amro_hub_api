import { Routes } from '@nestjs/core';
import { AuthModule } from './users/auth/auth.module';
import { ProductsModule } from './products/products.module';
import { AuthAdminModule } from './admin/auth/auth-admin.module';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';

export const appRoutes: Routes = [
  {
    path: 'dashboard',
    children: [
      { path: '/', module: AuthAdminModule },
      { path: '/', module: AdminModule },
      { path: '/', module: ProductsModule },
      { path: '/', module: UsersModule },
      { path: '/', module: ClientsModule },
    ],
  },
  {
    path: 'users',
    children: [{ path: '/', module: AuthModule }],
  },
];
