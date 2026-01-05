import { commands } from "./../../temps/commands.js";

export default {
    execute: async (client: any, message: any) => {
        const text = message.text;
        if (!text.startsWith("!")) return;
        const cmd = text.replace("!", "");
        const name = cmd.split(" ")[0];

        try {
            if (text.split(" ").length == 0) {
                await commands.get(name).execute(client, name, [], message);
                return;
            }
            const args = text.split(" ").slice(1);

            await commands.get(name).execute(client, name, [], message);
        } catch (error) {
            console.error(error);
        }
    }
}