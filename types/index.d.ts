export interface IModel<T> {
  getState: () => T;
  event: string;
  subscribe: (callback: () => void, needPrevious?: boolean) => () => void;
}

export function createModel<T>(value: T): IModel<T>;
export function createVirtualModel<K, C, T extends IModel<C>>(...models: T[]): (...values: C[]) => IModel<K>;
export function publishModel<T>(model: IModel<T>, value: T | ((nextValue: T) => T)): void;
