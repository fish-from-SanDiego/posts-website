export function getRandomRange(min, max) {
    if (min >= max) {
        throw new Error("Min value should be less than max value");
    }

    const lower = getRandomInt(min, max - 1); // in [min, max - 1) - inclusive
    const upper = getRandomInt(lower + 1, max + 1); // in [lower + 1, max) - exclusive

    return {lower, upper}; // [lower, upper)
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;

}