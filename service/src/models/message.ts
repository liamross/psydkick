import {Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  public id!: number;

  @CreateDateColumn()
  public cursor!: string;

  @CreateDateColumn()
  public createdAt!: string;

  @UpdateDateColumn()
  public updatedAt!: string;

  @Column()
  public content!: string;

  @Column()
  public senderId!: number;

  @Column()
  public chatId!: number;
}
