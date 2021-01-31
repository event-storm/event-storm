export interface IModel<T> {
  getState: () => T;
  event: string | string[];
  subscribe: (callback: () => void, needPrevious?: boolean) => () => void;
}

export interface IModelsHistory {
  goBack: () => void;
  goForward: () => void;
  hasNext: () => boolean;
  hasPrevious: () => boolean;
}

export function createModel<T>(value: T): IModel<T>;
export function createVirtualModel<T>(callback: () => T, options?: { models?: IModel<any>[] }) => IModel<T>;
export function publishModel<T>(model: IModel<T>, value: T | ((nextValue: T) => T)): void;

export function addMiddlewares(
  ...middlewares: Array<(previousValue: any, nextValue: any, options: { model: IModel<any> }) => void>
): void;

export function createHistory(models: IModel<any>[], options?: { captureExisting: boolean }): IModelsHistory;

export function createStore(options: { [key: string]: any} ): {
  getState: () => object;
  subscribe: ((key: string, value: any, model: IModel<any>) => void) => void;
  model: { [key: string]: IModel<any> };
};
