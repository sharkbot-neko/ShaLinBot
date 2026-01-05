import role from "../lib/role.ts";

export default {
    name: "setup",
    execute: async (client: any, name: string, args: string[], message: any, op: any) => {
        
        const chat = await client.talk.getChat({
            chatMid: message.to
        })

        if (chat.extra.groupExtra.creator != message.from) return;

        await role.add(message.to, message.from, "管理者");

        await client.talk.sendMessage({
            to: message.to === client.profile?.mid ? message.from : message.to,
            text: "セットアップをしました。\n・オーナーに管理者ロールを付与",
            e2ee: !!op.message.chunks,
        });
    }
}