export var roles: Map<string, number> = new Map();

export function createRole(name: string, perm: number): void {
    roles.set(name, perm)
    return;
}