import { mongo } from "./db.ts";

interface UserRoleDoc {
    gid: string;
    uid: string;
    roles: string[];
}

const getCollection = () => mongo.db("Line").collection<UserRoleDoc>("Roles");

export default {
    add: async function (gid: string, uid: string, roleid: string) {
        await getCollection().updateOne(
            { gid, uid },
            { $addToSet: { roles: roleid } },
            { upsert: true }
        );
    },

    remove: async function (gid: string, uid: string, roleid: string) {
        await getCollection().updateOne(
            { gid, uid },
            { $pull: { roles: roleid } }
        );
    },

    get: async function (gid: string, uid: string): Promise<string[]> {
        const doc = await getCollection().findOne({ gid, uid });
        return doc?.roles ?? [];
    },

    getPerm: async function (gid: string, uid: string): Promise<number> {
        const roles = await this.get(gid, uid);

        if (roles.includes("管理者")) return 10;
        if (roles.includes("モデレーター")) return 5;

        return 0;
    }
};