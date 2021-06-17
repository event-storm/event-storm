interface AnyObject {
  [key: string]: any;
};

export interface IModel<T> {
  getState: () => T;
  event: string | string[];
  publish: (value: T, options?: AnyObject) => void | Promise<T>;
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

export function addMiddlewares(
  ...middlewares: Array<(previousValue: any, nextValue: any, options: { model: IModel<any> }) => void>
): void;

export function createHistory(models: IModel<any>[], options?: { captureExisting: boolean }): IModelsHistory;

export interface IStore<T> {
  getState: () => T;
  subscribe: ((key: string, value: any, model: IModel<any>) => void) => void;
  model: { [key: string]: IModel<any> };
  publish: (segments: Partial<T>, options?: AnyObject) => void | Promise<any>;
}

export function createStore<T extends AnyObject>(options: T): IStore<T>;
