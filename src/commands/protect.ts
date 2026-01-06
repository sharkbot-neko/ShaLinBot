import protect from "../lib/protect.ts";
import role from "../lib/role.ts";

export default {
    name: "protect",
    execute: async (client: any, name: string, args: string[], message: any, op: any) => {
        if (args.length < 1) {
            return;
        }

        if (await role.getPerm(message.to, message.from) < 10) return;

        if (args[0] == "enable") {
            if (args.length < 2) {
                return;
            }

            if (!protect.listProtects().includes(args[1])) {
                await client.talk.sendMessage({
                    to: message.to === client.profile?.mid ? message.from : message.to,
                    text: "保護が見つかりません。",
                    e2ee: !!op.message.chunks,
                });
                return;
            };

            if (args[1] == "gname") {
                const chat = await client.talk.getChat({
                    chatMid: message.to
                })
                await protect.setContent(message.to, `${args[1]}_Content`, chat.chatName);
            }

            await protect.enableProtect(message.to, args[1]);

            await client.talk.sendMessage({
                to: message.to === client.profile?.mid ? message.from : message.to,
                text: "保護を有効化しました。",
                e2ee: !!op.message.chunks,
            });
        } else if (args[0] == "remove") {
            if (args.length < 2) {
                return;
            }

            if (!protect.listProtects().includes(args[1])) {
                await client.talk.sendMessage({
                    to: message.to === client.profile?.mid ? message.from : message.to,
                    text: "保護が見つかりません。",
                    e2ee: !!op.message.chunks,
                });
                return;
            };

            if (args[1] == "gname") {
                const chat = await client.talk.getChat({
                    chatMid: message.to
                })
                await protect.setContent(message.to, `${args[1]}_Content`, chat.chatName);
            }

            await protect.disableProtect(message.to, args[1]);
            await client.talk.sendMessage({
                to: message.to === client.profile?.mid ? message.from : message.to,
                text: "保護を無効化しました。",
                e2ee: !!op.message.chunks,
            });
        } else if (args[0] == "list") {
            const protects = await protect.listEnableProtects(message.to);
            await client.talk.sendMessage({
                to: message.to === client.profile?.mid ? message.from : message.to,
                text: `有効な保護一覧です\n${protects.join('\n')}`,
                e2ee: !!op.message.chunks,
            });
        } else if (args[0] == "kinds") {
            const protects = await protect.listProtects();
            await client.talk.sendMessage({
                to: message.to === client.profile?.mid ? message.from : message.to,
                text: `存在する保護一覧です\n${protects.join('\n')}`,
                e2ee: !!op.message.chunks,
            });
        }
    }
}