import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Word } from "./Word";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => Word, word => word.category)
  words: Word[];
}
