import {Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  public id!: number;

  @CreateDateColumn({type: 'datetime'})
  public createdAt!: Date;

  @UpdateDateColumn({type: 'datetime'})
  public updatedAt!: Date;

  @Column()
  public content!: string;

  @Column()
  public senderId!: number;

  @Column()
  public chatId!: number;
}
