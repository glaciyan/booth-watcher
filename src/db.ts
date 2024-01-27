import "reflect-metadata"
import { DataSource } from "typeorm";
import { BoothItem } from "./entity/BoothItem.js";

export const Database = new DataSource({
    type: "better-sqlite3",
    logging: true,
    synchronize: true,
    database: "booth.sqlite",
    entities: [BoothItem],
});
