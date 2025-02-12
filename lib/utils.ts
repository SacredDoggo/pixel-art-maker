// Create empty canvas grid
export const createEmptyGrid = (width: number, height: number): string[][] => {
    return Array.from({ length: height }, () =>
        Array.from({ length: width }, () => "#ffffff00")
    );
};