import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('increment')
  public id!: string;

  @CreateDateColumn({type: 'datetime'})
  public createdAt!: Date;

  @UpdateDateColumn({type: 'datetime'})
  public updatedAt!: Date;

  @Column()
  public content!: string;

  @Column()
  public senderId!: string;

  @Column()
  public chatId!: string;
}
