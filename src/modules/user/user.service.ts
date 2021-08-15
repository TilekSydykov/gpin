import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
  }

  async getAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getById(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  async create(productDto: CreateUserDto): Promise<User> {
    const newProduct = new this.userModel(productDto);
    return newProduct.save();
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndRemove(id);
  }

  async update(id: string, userDto: UpdateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, userDto, { new: true });
  }
}