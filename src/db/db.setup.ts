import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { UserEntity } from "../entities/user.entity";
import { TodoEntity } from "../entities/todo.entity";
import { Env } from "../env";

export const AppDataSouce = new DataSource({
  type: "mysql",
  database: Env.dbName,
  host: Env.host,
  username: Env.username,
  password: Env.password,
  port: Env.dbPort,
  logging: false,
  synchronize: true,
  entities: [UserEntity, TodoEntity],
  entitySkipConstructor: true,
  namingStrategy: new SnakeNamingStrategy(),
});
