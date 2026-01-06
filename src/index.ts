import { BaseClient } from "@evex/linejs/base";
import { FileStorage } from "@evex/linejs/storage";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import fs from "node:fs";
import { setCommand } from "./temps/commands.ts"
import { setEvents } from "./temps/events.ts"
import handle_event from "./events/execute.ts";
import { connect } from "./lib/db.ts";
import { createRole } from "./lib/defaultRoles.ts"

// ロール作成
createRole("管理者", 10);
createRole("モデレーター", 5)
createRole("メンバー", 0);;

connect();

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function load_command() {
    let commands = new Map();

    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);

        const modulePath = pathToFileURL(filePath).href;

        try {
            const module = await import(modulePath);
            const command = module.default || module;

            if ("name" in command && "execute" in command) {
                commands.set(command.name, command);
                console.log(`${command.name} をロードしました。`)
            } else {
                console.warn(`Warning: Command at ${filePath} is missing "name" or "execute".`);
            }
        } catch (err) {
            console.error(`Error loading command: ${filePath}`, err);
        }
    }

    setCommand(commands)
}

load_command();

async function load_event() {
    let events = new Map();

    const eventsPath = path.join(__dirname, 'events');
    const eventFolders = fs.readdirSync(eventsPath);

    for (const folder of eventFolders) {
        const folderPath = path.join(eventsPath, folder);
        if (!fs.lstatSync(folderPath).isDirectory()) continue;

        const eventFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.ts'));
        const eventName = folder;

        for (const file of eventFiles) {
            const filePath = path.join(folderPath, file);
            const event = await import(pathToFileURL(filePath).href);

            events.set(eventName + "_" + file.replace(".js", ""), event);
            console.log(`${eventName + "_" + file.replace(".js", "")} をロードしました。`)
        }
    }

    setEvents(events)
}

load_event();

const storage = new FileStorage("./storage.json");

const client = new BaseClient({
    device: "ANDROIDSECONDARY",
    storage: storage
});

client.on("pincall", (pin) => {
    console.log("pincode:", pin);
});

client.on("qrcall", (qrUrl) => {
    console.log("qrcode:", qrUrl);
});

client.on("update:authtoken", async (authToken) => {
    await storage.set(".auth", authToken);
});

client.on("log", (data) => {
    // console.log(data.data);
});

const authToken = await storage.get(".auth");
if (typeof authToken === "string") {
    await client.loginProcess.login({
        authToken,
    });
} else {
    await client.loginProcess.login({
        email: process.env.email as string,
        password: process.env.password as string,
    });
}

const polling = client.createPolling();

for await (const op of polling.listenTalkEvents()) {
    await handle_event(client, op);
}