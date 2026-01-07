import protect from "../../lib/protect.ts"

export default {
    execute: async (client: any, op: any) => {
        const gid = op?.param1;
        const uid = op?.param2;
        
        if (!gid || !uid) return;

        if (uid == client.profile.mid) return;

        const is_enable = await protect.isEnableProtect(gid, "gname");

        if (!is_enable) return;

        const chat = await client.talk.getChat({
            chatMid: gid
        })

        const oldName = await protect.getContent(gid, `gname_Content`);

        if (chat.chatName == oldName) return;

        await client.talk.updateChat({
            request: {
                reqSeq: await client.getReqseq(),
                chat: {
                    chatMid: gid,
                    chatName: oldName,
                },
                updatedAttribute: "NAME",
            },
        });

        await client.talk.sendMessage({
            to: gid,
            text: "グループ名が変更されたため、\n前の名前に戻しました。",
            e2ee: true,
        });
    }
}