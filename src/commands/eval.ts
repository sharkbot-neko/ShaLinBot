import isOwner from "../lib/isOnwer.ts"

export default {
    name: "eval",
    execute: async (client: any, name: string, args: string[], message: any, op: any) => {
		const isOw = isOwner(message.from);
        if (!isOw) return;

        try {
            const eval_func = Function(args.join(" "));
            const ret = eval_func();

            await client.talk.sendMessage({
                to: message.to === client.profile?.mid ? message.from : message.to,
                text: `${ret}`,
                e2ee: !!op.message.chunks,
            });
        } catch {
            await client.talk.sendMessage({
                to: message.to === client.profile?.mid ? message.from : message.to,
                text: `エラーが発生しました。`,
                e2ee: !!op.message.chunks,
            });
            return;
        }
	}
}