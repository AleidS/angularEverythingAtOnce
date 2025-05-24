export const asyncForEach = async (array: any[], next: any) => {
    for (let i = 0;i<array.length;i++) {
        await next(array[i], i, array);
    }
}