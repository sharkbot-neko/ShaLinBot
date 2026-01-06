import { events } from "./../temps/events.ts";

export default async function handle_event(client: any, op: any) {

	if (op.type === "RECEIVE_MESSAGE" || op.type === "SEND_MESSAGE") {
		events.forEach(async (value: any, key: string) => {
            const message = await client.e2ee.decryptE2EEMessage(op.message);
            if (key.startsWith("messageCreate")) {
                await value.default.execute(client, op, message)
            }
        })
	} else if (op.type === "NOTIFIED_JOIN_CHAT") {
        // ここに参加ログ
    } else if (op.type === "NOTIFIED_UPDATE_CHAT") {
		events.forEach(async (value: any, key: string) => {
            if (key.startsWith("groupUpdate")) {
                await value.default.execute(client, op)
            }
        })
    } else {
        console.log(op);
    }
}