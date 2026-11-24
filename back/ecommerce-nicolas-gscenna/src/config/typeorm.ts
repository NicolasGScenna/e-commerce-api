
import { DataSourceOptions, DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';

import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/cateogry.entity';
import { Order } from '../entities/order.entity';
import { OrderDetail } from '../entities/order-details.entity';

dotenvConfig({ path: '.env.development' });
console.log('[TypeORM] DATABASE_URL cargada:', Boolean(process.env.DATABASE_URL));

console.log(
  '[TypeORM] Host:',
  process.env.DATABASE_URL
    ? new URL(process.env.DATABASE_URL).hostname
    : 'NO DISPONIBLE',
);

const config: DataSourceOptions = {
  type: 'postgres',

  url: process.env.DATABASE_URL,

  synchronize: false,

  logging: true,

  entities: [
    User,
    Product,
    Category,
    Order,
    OrderDetail,
  ],

  migrations: [
    __dirname + '/../migrations/*{.ts,.js}',
  ],
};

export default registerAs('typeorm', () => config);

export const connectionSource = new DataSource(config);
