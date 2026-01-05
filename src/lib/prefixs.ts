import { DatabaseSync } from "node:sqlite";
import { mongo } from "./db.ts"

export default {
    set: async function (gid: string, prefix: string) {
      const db = mongo.db("Line")
      const collection = db.collection("Prefix");

      await collection.updateOne({
        "gid": gid
      }, {
        "$set": {
          "prefix": prefix
        }
      }, {
        upsert: true
      })
    },

    get: async function (gid: string): Promise<string> {
      const db = mongo.db("Line")
      const collection = db.collection("Prefix");
      const find = await collection.findOne({gid: gid})

      if (!find) return "!";

      return find.prefix as string;
    },

    reset: function (gid: string) {
      const db = mongo.db("Line")
      const collection = db.collection("Prefix");
      collection.deleteOne({
        gid: gid
      })
    }
}