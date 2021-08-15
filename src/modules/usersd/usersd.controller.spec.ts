import { Test, TestingModule } from '@nestjs/testing';
import { UsersdController } from './usersd.controller';

describe('UsersdController', () => {
  let controller: UsersdController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersdController],
    }).compile();

    controller = module.get<UsersdController>(UsersdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
