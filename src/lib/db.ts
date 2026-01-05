import { DatabaseSync } from "node:sqlite";

export default function db() {
    const db = new DatabaseSync("data.db");

    return db;
}