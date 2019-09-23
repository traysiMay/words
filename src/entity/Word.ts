import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Category } from "./Category";

@Entity()
export class Word {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  word: string;

  @Column()
  vote: number;

  @Column()
  publisher: string;

  @Column()
  color: string;

  @Column()
  text_color: string;

  @ManyToOne(type => Category, category => category.words)
  category: Category;
}
