import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', unique: true })
  telegram_id: number;

  @Column({ nullable: true })
  username: string;

  @Column()
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column()
  is_bot: boolean;

  @CreateDateColumn()
  created_at: Date;
}
