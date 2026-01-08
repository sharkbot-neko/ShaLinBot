import { mongo } from "./../../lib/db.ts";

export default {
    execute: async (client: any, op: any) => {
        const gid = op?.param1;

        if (!gid) return;

        const db = mongo.db("Line")
        const collection = db.collection("JoinMessage");
        const finded = await collection.findOne({
            "gid": gid
        })

        if (!finded) return;

        await client.talk.sendMessage({
            to: gid,
            text: "誰かが参加したよ",
            e2ee: true,
        });
    }
}