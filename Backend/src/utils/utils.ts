export const safeAverage = (total: number, count: number) => {
    if (count === 0) return 0;
    return Number((total / count).toFixed(1));
};
