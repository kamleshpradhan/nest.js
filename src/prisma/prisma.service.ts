import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
// import { Config } from 'prettier';
// import { config } from 'process';

@Injectable()
export class PrismaService extends PrismaClient {
  static cleanDb() {
    throw new Error('Method not implemented.');
  }
  constructor(config:ConfigService) {
    super({
      datasources: {
        db: {
          url:config.get('DATABASE_URL')
        },
      },
    });
  }
  cleanDb(){
    return this.$transaction([
    this.bookmark.deleteMany(),
    this.user.deleteMany()
    ]);
  }
}
