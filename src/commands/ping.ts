export default {
    name: "ping",
    execute: async (client: any, name: string, args: string[], message: any, op: any) => {
		const start = Date.now();
		await client.talk.sendMessage({
			to: message.to === client.profile?.mid ? message.from : message.to,
			text: "計測中・・",
			e2ee: !!op.message.chunks,
		});
        const end = Date.now();
		await client.talk.sendMessage({
			to: message.to === client.profile?.mid ? message.from : message.to,
			text: `🏓Pong! ${end - start}m`,
			e2ee: !!op.message.chunks,
		});
	}
}