export default function generateId(): string {
    let result = "";
    for (let i = 0; i < 15; i++) {
        result += Math.floor(Math.random() * 9);
    }
    return result;
}