import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';

@Module({
  providers: [StorageService]
})
export class StorageModule {}
