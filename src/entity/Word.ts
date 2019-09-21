import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Word {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  word: string;
}
