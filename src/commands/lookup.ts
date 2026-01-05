import role from "../lib/role.ts";

export default {
    name: "lookup",
    execute: async (client: any, name: string, args: string[], message: any, op: any) => {
        if (args.length < 1) {
            return;
        }

        if (await role.getPerm(message.to, message.from) < 5) return;

        const midData = await client.talk.getContact({ mid: args[0] });

        await client.talk.sendMessage({
            to: message.to,
            text: `${midData.displayName}の情報\n` +
                `Mid: ${midData.mid}\n` +
                `ステータスメッセージ: ${midData.statusMessage || "なし"}\n` +
                `アイコン:\nhttp://dl.profile.line-cdn.net${midData.picturePath || ""}`
        });
    }
}