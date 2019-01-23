import {Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  public id!: number;

  @CreateDateColumn()
  public cursor!: string;

  @CreateDateColumn()
  public createdAt!: string;

  @UpdateDateColumn()
  public updatedAt!: string;

  @Column()
  public clientId!: number;

  @Column()
  public therapistId!: number;
}
