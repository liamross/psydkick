import {Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  public id!: number;

  @CreateDateColumn()
  public cursor!: string;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;

  @Column()
  public clientId!: number;

  @Column()
  public therapistId!: number;
}
