import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    return this.userRepository.save(userData);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(telegram_id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { telegram_id } });
  }


  async update(id: number, updateData: Partial<User>): Promise<void> {
    await this.userRepository.update(id, updateData);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
  async createOrUpdateUser(userData: Partial<User>): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { telegram_id: userData.telegram_id },
    });

    if (user) {
      await this.userRepository.update({ telegram_id: userData.telegram_id }, userData);
    } else {
      user = this.userRepository.create(userData);
      await this.userRepository.save(user);
    }

    return user;
  }

}
