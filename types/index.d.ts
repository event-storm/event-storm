interface IModel<T> {
  getState: () => T;
  event: string;
  subscribe: (callback: () => void, needPrevious?: boolean): () => void;
}

export function createModel<T>(value: T): IModel<T>;
export function createVirtualModel<T, K>(IModel<T>[]): (values: T[]): K => IModel<K>;
export function publishModel<T>(IModel<T>, T | (value: T) => T): void;
