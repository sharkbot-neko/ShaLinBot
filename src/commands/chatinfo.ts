import role from "../lib/role.ts";

export default {
    name: "chatinfo",
    execute: async (client: any, name: string, args: string[], message: any, op: any) => {
        if (await role.getPerm(message.to, message.from) < 5) return;

        const chat = await client.talk.getChat({
            chatMid: message.to
        })

		await client.talk.sendMessage({
			to: message.to === client.profile?.mid ? message.from : message.to,
			text: `
チャット名: ${chat.chatName}\n
MID: ${chat.chatMid}\n
作成時間: ${chat.createdTime}
作成者のMID: ${chat.extra.groupExtra.creator}
アイコン: https://profile.line-scdn.net${chat.picturePath}
`,
			e2ee: !!op.message.chunks,
		});
    }
}