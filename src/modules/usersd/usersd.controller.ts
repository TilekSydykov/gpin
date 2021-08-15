import {Body,Controller,Delete,Get,HttpCode,HttpStatus,Param,Post,Put,} from '@nestjs/common';
import { CreateUsersdDto } from './dto/create-usersd.dto';
import { UpdateUsersdDto } from './dto/update-usersd.dto';
import { UsersdService } from './usersd.service';
import { Usersd } from './schema/usersd.schema';

@Controller('usersd')
export class UsersdController {
  constructor(private readonly usersdService: UsersdService) {}

  @Get()
  getAll(): Promise<Usersd[]> {
    return this.usersdService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Usersd> {
    return this.usersdService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUsersdDto: CreateUsersdDto): Promise<Usersd> {
    return this.usersdService.create(createUsersdDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Usersd> {
    return this.usersdService.remove(id);
  }

  @Put(':id')
  update(
    @Body() updateUsersdDto: UpdateUsersdDto, 
    @Param('id') id: string,
  ): Promise<Usersd> {
    return this.usersdService.update(id, updateUsersdDto);
  }
}
