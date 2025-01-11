import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { CoreEntity } from "./core.entity";
import { UserEntity } from "./user.entity";

@Entity("todo")
export class TodoEntity extends CoreEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ type: "varchar", nullable: false })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "boolean", default: false })
  completed: boolean;

  @Column({ type: "timestamp", nullable: true })
  dueDate: Date;

  @Column({ name: "user_uuid" })
  userUuid: string;

  @Column({ type: "boolean", default: false })
  deleted: boolean;

  
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: "user_uuid" })
  user: UserEntity;
} 