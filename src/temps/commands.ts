export var commands = new Map();

export function setCommand(map: Map<string, any>): void {
    commands = map
    return;
}