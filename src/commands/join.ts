import protect from "../lib/protect.ts";
import role from "../lib/role.ts";
import { mongo } from "./../lib/db.ts";

export default {
    name: "join",
    execute: async (client: any, name: string, args: string[], message: any, op: any) => {
        if (args.length < 1) {
            return;
        }

        if (await role.getPerm(message.to, message.from) < 10) return;

        const db = mongo.db("Line")
        const collection = db.collection("JoinMessage");

        if (args[0] == "enable") {
            await collection.updateOne({
                "gid": message.to
            }, {
                "$set": {
                    "gid": message.to
                }
            }, {
                upsert: true
            })

            await client.talk.sendMessage({
                to: message.to === client.profile?.mid ? message.from : message.to,
                text: "参加メッセージを有効化しました。",
                e2ee: !!op.message.chunks,
            });
        } else if (args[0] == "disable") {
            await collection.deleteOne({
                "gid": message.to
            })

            await client.talk.sendMessage({
                to: message.to === client.profile?.mid ? message.from : message.to,
                text: "参加メッセージを無効化しました。",
                e2ee: !!op.message.chunks,
            });
        }
    }
}