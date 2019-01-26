import {Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @CreateDateColumn({type: 'datetime'})
  public createdAt!: Date;

  @UpdateDateColumn({type: 'datetime'})
  public updatedAt!: Date;

  @Column()
  public name!: string;
}
