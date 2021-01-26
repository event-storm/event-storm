export interface IModel<T> {
  getState: () => T;
  event: string;
  subscribe: (callback: () => void, needPrevious?: boolean) => () => void;
}

export function createModel<T>(value: T): IModel<T>;
export function createVirtualModel<K, T extends IModel<K>[]>(...models: T): (callback: (...values: any) => any) => IModel<K>;
export function publishModel<T>(model: IModel<T>, value: T | ((nextValue: T) => T)): void;
