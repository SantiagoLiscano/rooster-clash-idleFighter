export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function wait(ms: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}
