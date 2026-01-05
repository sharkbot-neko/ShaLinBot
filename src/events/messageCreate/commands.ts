import prefixs from "../../lib/prefixs.ts";
import { commands } from "./../../temps/commands.ts";

export default {
    // deno-lint-ignore no-explicit-any
    execute: async (client: any, op: any, message: any) => {
        const text = message.text?.trim();
        if (!text) return;

        console.log(text)

        const prefix = message.from ? (prefixs.get(message.from) ?? "!") : "!";

        if (!text.startsWith(prefix)) return;

        const fullContent = text.slice(prefix.length).trim();
        if (!fullContent) return;

        const parts = fullContent.split(/\s+/);
        const commandName = parts[0].toLowerCase();
        const args = parts.slice(1);

        try {
            const command = commands.get(commandName);
            
            if (!command) {
                return;
            }

            await command.execute(client, commandName, args, message, op);
            
        } catch (error) {
            console.error(`Command Error (${commandName}):`, error);
        }
    }
}