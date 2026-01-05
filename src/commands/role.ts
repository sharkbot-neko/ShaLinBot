import role from "../lib/role.ts";

export default {
    name: "role",
    execute: async (client: any, name: string, args: string[], message: any, op: any) => {
        if (args.length < 2) {
            return;
        }

        if (await role.getPerm(message.to, message.from) < 10) return;

        if (args[0] == "add") {
            if (args.length < 3) {
                return;
            }

            await role.add(message.to, args[1], args[2]);
            await client.talk.sendMessage({
                to: message.to === client.profile?.mid ? message.from : message.to,
                text: "ロールを追加しました、",
                e2ee: !!op.message.chunks,
            });
        } else if (args[0] == "remove") {
            if (args.length < 3) {
                return;
            }

            await role.remove(message.to, args[1], args[2]);
            await client.talk.sendMessage({
                to: message.to === client.profile?.mid ? message.from : message.to,
                text: "ロールを剥奪しました、",
                e2ee: !!op.message.chunks,
            });
        } else if (args[0] == "list") {
            const roles = await role.get(message.to, args[1]);
            await client.talk.sendMessage({
                to: message.to === client.profile?.mid ? message.from : message.to,
                text: `ロール一覧です。\n${roles.join('\n')}`,
                e2ee: !!op.message.chunks,
            });
        } else if (args[0] == "perm") {
            const perm = await role.getPerm(message.to, args[1]);
            await client.talk.sendMessage({
                to: message.to === client.profile?.mid ? message.from : message.to,
                text: `その人の権限: ${perm}`,
                e2ee: !!op.message.chunks,
            });
        }
    }
}