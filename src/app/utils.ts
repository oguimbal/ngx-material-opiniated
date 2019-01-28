export function delay(time: number) {
    return new Promise(done => setTimeout(done, time));
}