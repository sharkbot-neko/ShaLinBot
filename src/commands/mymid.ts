export default {
    name: "mymid",
    execute: async (client: any, name: string, args: string[], message: any, op: any) => {
		await client.talk.sendMessage({
			to: message.to === client.profile?.mid ? message.from : message.to,
			text: `あなたのMID\n${message.from}`,
			e2ee: !!op.message.chunks,
		});
	}
}