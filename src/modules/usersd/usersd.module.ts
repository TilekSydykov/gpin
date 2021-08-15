import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersdService } from './usersd.service';
import { UsersdController } from './usersd.controller';
import { Usersd, UsersdSchema } from './schema/usersd.schema';

@Module({
  providers: [UsersdService],
  controllers: [UsersdController],
  imports: [
    MongooseModule.forFeature([{ name: Usersd.name, schema: UsersdSchema}])
  ],
})
export class UsersdModule {}
