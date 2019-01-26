import {Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, Generated} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  public id!: number;

  @CreateDateColumn({type: 'datetime'})
  public createdAt!: Date;

  @UpdateDateColumn({type: 'datetime'})
  public updatedAt!: Date;

  @Column()
  public clientId!: number;

  @Column()
  public therapistId!: number;
}
