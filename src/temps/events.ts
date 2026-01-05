export var events = new Map();

export function setEvents(map: Map<string, any>): void {
    events = map
    return;
}