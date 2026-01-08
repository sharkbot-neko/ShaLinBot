import process from "node:process";

export default function isOwner(mid: string) {
    return process.env.owner === mid;
}