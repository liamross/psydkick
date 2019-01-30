import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('increment')
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
