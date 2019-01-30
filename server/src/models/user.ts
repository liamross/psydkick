import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id!: number;

  @CreateDateColumn({type: 'datetime'})
  public createdAt!: Date;

  @UpdateDateColumn({type: 'datetime'})
  public updatedAt!: Date;

  @Column()
  public name!: string;
}
