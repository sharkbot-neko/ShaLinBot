import role from "../lib/role.ts";
import prefix from "./../lib/prefixs.ts"

export default {
    name: "prefix",
    execute: async (client: any, name: string, args: string[], message: any, op: any) => {
        if (args.length < 1) {
            return;
        }

        if (await role.getPerm(message.to, message.from) < 10) return;

        await prefix.set(message.to, args[0] as any);
		await client.talk.sendMessage({
			to: message.to === client.profile?.mid ? message.from : message.to,
			text: "頭文字を変更しました。",
			e2ee: !!op.message.chunks,
		});
    }
}