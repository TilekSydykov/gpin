import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUsersdDto } from './dto/create-usersd.dto';
import { Usersd, UsersdDocument } from './schema/usersd.schema';
import { UpdateUsersdDto } from './dto/update-usersd.dto';

@Injectable()
export class UsersdService {
  constructor(@InjectModel(Usersd.name) private usersdModel: Model<UsersdDocument>) {
  }

  async getAll(): Promise<Usersd[]> {
    return this.usersdModel.find().exec();
  }

  async getById(id: string): Promise<Usersd> {
    return this.usersdModel.findById(id);
  }

  async create(productDto: CreateUsersdDto): Promise<Usersd> {
    const newProduct = new this.usersdModel(productDto);
    return newProduct.save();
  }

  async remove(id: string): Promise<Usersd> {
    return this.usersdModel.findByIdAndRemove(id);
  }

  async update(id: string, usersdDto: UpdateUsersdDto): Promise<Usersd> {
    return this.usersdModel.findByIdAndUpdate(id, usersdDto, { new: true });
  }
}