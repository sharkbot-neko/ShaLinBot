import { events } from "./../temps/events.js";

export default async function handle_event(client: any, op: any) {

	if (op.type === "RECEIVE_MESSAGE" || op.type === "SEND_MESSAGE") {
        console.log(events)
		events.forEach(async (value: any, key: string) => {
            const message = await client.e2ee.decryptE2EEMessage(op.message);
            if (key.startsWith("messageCreate")) {
                await value.default.execute(client, message)
            }
        })
	} else if (op.type === "NOTIFIED_JOIN_CHAT") {
        // ここに参加ログ
    }
}