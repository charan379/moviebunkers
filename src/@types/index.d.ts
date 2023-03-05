

type NonNullableObject<T> = {
    [K in keyof T as T[K] extends null ? never : K]: T[K];
};