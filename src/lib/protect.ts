import { mongo } from "./db.ts";

const getCollection = () => mongo.db("Line").collection("Protects");

export default {
    getContent: async function (gid: string, contentId: string) {
        try {
            const find = await getCollection().findOne({ gid });

            if (!find) return;

            const content = find[contentId];
            return content;
        } catch {
            return;
        }
    },

    setContent: async function (gid: string, contentId: string, content: string) {
        await getCollection().updateOne(
            { gid },
            { $set: { [contentId]: content } },
            { upsert: true }
        );
    },

    enableProtect: async function (gid: string, protectId: string) {
        await getCollection().updateOne(
            { gid },
            { $addToSet: { protects: protectId } },
            { upsert: true }
        );
    },

    disableProtect: async function (gid: string, protectId: string) {
        await getCollection().updateOne(
            { gid },
            { $pull: { protects: protectId as any } },
            { upsert: true }
        );
    },

    isEnableProtect: async function (gid: string, protectId: string) {
        const find = await getCollection().findOne({ gid });

        if (!find) return false;

        const protect = find.protects as string[]
        return protect.includes(protectId)
    },

    listEnableProtects: async function (gid: string) {
        const find = await getCollection().findOne({ gid });

        if (!find) return [];

        const protect = find.protects as string[]
        return protect;
    },

    listProtects: function () {
        return [
            "gname"
        ];
    },
    
};